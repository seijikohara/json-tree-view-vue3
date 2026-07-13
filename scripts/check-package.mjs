// publint lints package.json/exports directly; attw needs a real,
// installable tarball to inspect the built dist/ exports and types.
// `attw --pack .` shells out to `npm pack`, which fails under pnpm-only
// devEngines with EBADDEVENGINES (Wave 1 finding), so this script builds
// the tarball with `pnpm pack` at a fixed filename and hands it to attw
// directly, propagating whichever step's exit code failed. A try/finally
// cleans up the tarball if pack or attw fails; a leading cleanup also
// clears any tarball left by an interrupted prior run, so the guarantee
// holds even when publint itself fails early. The run() helper also logs
// spawnSync's `.error`, so a step that fails to start (rather than
// exiting non-zero) reports its root cause instead of just a generic
// exit code.
//
// `./style.css` is excluded from attw's entrypoint analysis: it is a
// CSS-only side-effect export (`import 'json-tree-view-vue3/style.css'`),
// not a JS/TS module, so attw's resolution checks always report it as
// an unresolvable entrypoint (a documented false positive -- see
// https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/NoResolution.md).
// publint (run first, above) already asserts the file exists at the
// exports-mapped path, so this exclusion does not remove real coverage.
import { spawnSync } from 'node:child_process'
import { rmSync } from 'node:fs'

const TARBALL = 'package.tgz'

const run = (label, command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit' })

  if (result.error) {
    console.error(`check:package: could not run ${label}:`, result.error.message)
  }

  return result.status ?? 1
}

// Clears a tarball left behind by an interrupted prior run up front,
// since the try/finally below only runs once publint has passed.
rmSync(TARBALL, { force: true })

let code = run('publint', 'pnpm', ['exec', 'publint'])

if (code === 0) {
  try {
    code = run('pnpm pack', 'pnpm', ['pack', '--out', TARBALL])

    if (code === 0) {
      // TARBALL must precede --exclude-entrypoints: it is a variadic
      // option (accepts one or more values) and would otherwise swallow
      // the tarball path as one of its own entrypoint arguments, leaving
      // attw with no positional target to analyze.
      code = run('attw', 'pnpm', [
        'exec',
        'attw',
        '--profile',
        'esm-only',
        TARBALL,
        '--exclude-entrypoints',
        './style.css'
      ])
    }
  } finally {
    rmSync(TARBALL, { force: true })
  }
}

process.exitCode = code
