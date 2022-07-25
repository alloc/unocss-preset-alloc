const { crawl } = require('recrawl')
const { clear, success } = require('misty')
const { startTask } = require('misty/task')
const { readFile, access, readdir, writeFile, unlink } = require('fs/promises')
const { resolve, join } = require('path')
const exec = require('@cush/exec')
const prettier = require('prettier')
const { gray, green, red } = require('kleur')

process.stdout.isTTY = true
clear()
main()

async function main() {
  let task = startTask('Downloading upstream')

  const upstreamDir = 'upstream'
  if (await exists(upstreamDir)) {
    await exec('git fetch origin main', { cwd: upstreamDir })
    await exec('git reset --hard origin/main', { cwd: upstreamDir })
  } else {
    await exec('git clone https://github.com/unocss/unocss --depth 1', [
      upstreamDir,
    ])
  }

  task.finish()
  task = startTask('Patching upstream')

  const patches = await readdir('patches')
  for (let patch of patches) {
    patch = resolve('patches', patch)
    await exec('git am --ignore-whitespace', [patch], {
      cwd: upstreamDir,
    })
  }

  task.finish(`${patches.length} patches applied.`)
  task = startTask('Updating files')

  const readText = file => readFile(file, 'utf8')
  const prettierConfig = await import('@alloc/prettier-config', {
    assert: { type: 'json' },
  })

  const roots = {
    ours: 'src',
    theirs: resolve(upstreamDir, 'packages/preset-mini/src'),
  }

  const globs = [
    '/rules/**.ts',
    '/utils/**.ts',
    '/theme/**.ts',
    '/variants/**.ts',
  ]

  const upstreamFiles = await crawl(roots.theirs, {
    only: globs,
  })

  for (let file of upstreamFiles) {
    const upstreamFile = join(roots.theirs, file)
    const newCode = prettier.format(await readText(upstreamFile), {
      parser: 'typescript',
      ...prettierConfig.default,
    })

    let oldCode
    try {
      file = join(roots.ours, file)
      oldCode = await readText(file)
    } catch {}

    if (newCode !== oldCode) {
      await writeFile(file, newCode)
      success(oldCode ? file : green(file))
    } else {
      success(gray(file))
    }
  }

  const oldFiles = await crawl(roots.ours, {
    only: globs,
  })

  for (let file of oldFiles) {
    if (!upstreamFiles.includes(file)) {
      file = join(roots.ours, file)
      await unlink(file)
      success(red(file))
    }
  }

  task.finish()
}

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}
