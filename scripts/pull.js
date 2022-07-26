const { crawl } = require('recrawl')
const { clear, success } = require('misty')
const { startTask } = require('misty/task')
const { readFile, access, readdir, writeFile, unlink } = require('fs/promises')
const { resolve, join, relative } = require('path')
const exec = require('@cush/exec')
const prettier = require('prettier')
const { gray, green, red } = require('kleur')

process.stdout.isTTY = true
clear()
main()

async function main() {
  let task = startTask('Downloading upstream')

  const prevHead = (await exists('upstream.txt'))
    ? await readFile('upstream.txt', 'utf8')
    : null

  const upstreamDir = 'upstream'
  if (await exists(upstreamDir)) {
    await exec('git fetch origin main', { cwd: upstreamDir })
    await exec('git reset --hard origin/main', { cwd: upstreamDir })
  } else {
    await exec('git clone https://github.com/unocss/unocss --depth 1', [
      upstreamDir,
    ])
  }

  const head = await exec('git rev-parse HEAD', { cwd: upstreamDir })
  if (head !== prevHead) {
    await writeFile('upstream.txt', head)
  } else {
    task.finish()
    return success(
      'No changes required?\n' +
        gray('  You may want to delete ./upstream.txt if patches have changed.')
    )
  }

  task.finish()
  task = startTask('Updating files')

  const readText = file => readFile(file, 'utf8')
  const prettierConfig = await import('@alloc/prettier-config', {
    assert: { type: 'json' },
  })

  const upstreamPkgRoot = 'packages/preset-mini'
  const upstreamSrcDir = join(upstreamPkgRoot, 'src')
  const roots = {
    ours: 'src',
    theirs: resolve(upstreamDir, upstreamSrcDir),
  }

  const dirs = ['rules', 'utils', 'theme', 'variants']
  const crawlGlobs = dirs.map(dir => `/${dir}/**.ts`)

  // Use git to get the list of files that have changed
  // since the `head` commit.
  let changedFiles
  if (prevHead) {
    const stdout = await exec(
      `git diff --name-only ${prevHead}..${head} --`,
      dirs.map(dir => join(upstreamSrcDir, dir)),
      { cwd: upstreamDir }
    )
    changedFiles = stdout
      .split('\n')
      .map(file => relative(upstreamSrcDir, file))
      .filter(file => file.endsWith('.ts'))
  } else {
    changedFiles = await crawl(roots.theirs, {
      only: crawlGlobs,
    })
  }

  const deletedFiles = new Set()

  let theirCode, ourCode
  for (let file of changedFiles) {
    const theirFile = join(roots.theirs, file)
    if (await exists(theirFile)) {
      theirCode = prettier.format(await readText(theirFile), {
        parser: 'typescript',
        ...prettierConfig.default,
      })
    } else {
      deletedFiles.add(file)
      continue
    }

    try {
      file = join(roots.ours, file)
      ourCode = await readText(file)
    } catch {
      ourCode = ''
    }

    if (theirCode !== ourCode) {
      await writeFile(file, theirCode)
      success(ourCode ? file : green(file))
    } else {
      success(gray(file))
    }
  }

  const ourFiles = await crawl(roots.ours, {
    only: crawlGlobs,
  })

  for (let file of ourFiles) {
    file = join(roots.ours, file)
    if (deletedFiles.has(file)) {
      await unlink(file)
      success(red(file))
    }
  }

  task.finish()
  task = startTask('Applying patches')

  const patches = await readdir('patches')
  for (const name of patches) {
    const file = resolve('patches', name)
    try {
      await exec(`git apply --ignore-whitespace ${file}`)
    } catch (e) {
      console.log('\n' + red(`Patch failed: "${name}"`))
      console.error(e)
      process.exit(1)
    }
  }

  task.finish(`${patches.length} patches applied.`)
}

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}
