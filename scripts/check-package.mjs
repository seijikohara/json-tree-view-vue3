// publint lints package.json/exports directly; attw needs a real,
// installable tarball to inspect the built dist/ exports and types.
// `attw --pack .` shells out to `npm pack`, which fails under pnpm-only
// devEngines with EBADDEVENGINES (Wave 1 finding), so this script builds
// the tarball with `pnpm pack` at a fixed filename and hands it to attw
// directly, propagating whichever step's exit code failed and always
// cleaning up the tarball before this process exits.
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

const publint = spawnSync('pnpm', ['exec', 'publint'], { stdio: 'inherit' })

if (publint.status !== 0) {
  process.exitCode = publint.status ?? 1
} else {
  const pack = spawnSync('pnpm', ['pack', '--out', TARBALL], { stdio: 'inherit' })

  if (pack.status !== 0) {
    process.exitCode = pack.status ?? 1
  } else {
    // TARBALL must precede --exclude-entrypoints: it is a variadic
    // option (accepts one or more values) and would otherwise swallow
    // the tarball path as one of its own entrypoint arguments, leaving
    // attw with no positional target to analyze.
    const attw = spawnSync(
      'pnpm',
      ['exec', 'attw', '--profile', 'esm-only', TARBALL, '--exclude-entrypoints', './style.css'],
      { stdio: 'inherit' }
    )

    rmSync(TARBALL, { force: true })
    process.exitCode = attw.status ?? 1
  }
}
