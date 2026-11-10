#!/usr/bin/env node
/**
 * Static checks that run locally and in CI:
 *   node tools/check.mjs
 *
 * It covers everything that can be verified without the third-party build
 * inputs (assets/ + vendor/): syntax, JSON validity, plugin manifests and the
 * template's placeholder set. When assets/ is absent it also asserts that the
 * build script fails with a helpful message instead of crashing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const results = [];
const check = (name, fn) => {
  try {
    const detail = fn();
    results.push({ name, ok: true, detail: detail || '' });
  } catch (error) {
    results.push({ name, ok: false, detail: error.message });
  }
};

const read = (relative) => fs.readFileSync(path.join(ROOT, relative), 'utf8');
const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
};

const JS_FILES = [
  'index.js',
  'plugins/cyan-theme/client.js',
  'plugins/flat-corners/client.js',
  'plugins/parallax-bg/index.js',
  'plugins/cyan-theme/index.js',
  'plugins/flat-corners/index.js',
  'src/parallax-bg/client.template.js',
  'tools/build-parallax.mjs',
];
const PLUGINS = [
  { dir: 'cyan-theme', name: 'dsh-exv-cyan-theme' },
  { dir: 'parallax-bg', name: 'dsh-exv-parallax-bg' },
  { dir: 'flat-corners', name: 'dsh-exv-flat-corners' },
];
const IMAGE_TOKENS = [
  '__BACKGROUND__', '__LOGO__', '__WORDMARK__', '__VV__', '__CHIPS__', '__CYBERPUNK__',
  '__STARSKY__', '__FRANKFURT__', '__VV_SCARH__', '__VV_HK416__', '__VV_SCARL__',
  '__VV_UMP45__', '__VV_VECTOR__', '__VV_AK12__', '__VV_M200__', '__VV_AK74M__',
];

check('syntax: javascript files', () => {
  for (const file of JS_FILES) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) throw new Error('missing ' + file);
    const run = spawnSync(process.execPath, ['--check', full], { encoding: 'utf8' });
    if (run.status !== 0) throw new Error(`${file}: ${(run.stderr || '').trim().split('\n')[0]}`);
  }
  return `${JS_FILES.length} files`;
});

check('json: every json file parses', () => {
  const files = walk(ROOT).filter((file) => file.endsWith('.json'));
  for (const file of files) JSON.parse(fs.readFileSync(file, 'utf8'));
  return `${files.length} files`;
});

check('plugins: manifests and patch files', () => {
  for (const { dir, name } of PLUGINS) {
    const manifest = JSON.parse(read(`plugins/${dir}/package.json`));
    if (manifest.name !== name) throw new Error(`${dir}: unexpected name ${manifest.name}`);
    if (manifest.private === true) throw new Error(`${dir}: must not be private`);
    if (!manifest.dsh || !manifest.dsh.bundle || !manifest.dsh.bundle.patch) throw new Error(`${dir}: missing dsh.bundle.patch`);
    if (!fs.existsSync(path.join(ROOT, 'plugins', dir, manifest.dsh.bundle.patch))) throw new Error(`${dir}: patch file missing`);
    if (!manifest.dsh.client || manifest.dsh.client.platform !== 'web') throw new Error(`${dir}: missing dsh.client.platform`);
    const patch = read(`plugins/${dir}/cordis.patch.yml`);
    if (!patch.includes(`id: ${dir}`)) throw new Error(`${dir}: patch does not insert its id`);
    if (!patch.includes(`name: '${name}'`)) throw new Error(`${dir}: patch does not name ${name}`);
  }
  return `${PLUGINS.length} plugins`;
});

check('bundle: repository root is an installable umbrella', () => {
  const manifest = JSON.parse(read('package.json'));
  if (manifest.name !== 'dsh-exv-theme') throw new Error('unexpected root name ' + manifest.name);
  if (manifest.private === true) throw new Error('root package must not be private');
  if (!manifest.dsh || !manifest.dsh.bundle || !manifest.dsh.bundle.patch) throw new Error('missing dsh.bundle.patch');
  if (!fs.existsSync(path.join(ROOT, manifest.dsh.bundle.patch))) throw new Error('patch file missing');
  if (!manifest.engines || typeof manifest.engines.dsh !== 'string') throw new Error('missing engines.dsh');
  const patch = read(manifest.dsh.bundle.patch);
  for (const { name } of PLUGINS) {
    if (!patch.includes(`name: '${name}'`)) throw new Error('root patch does not insert ' + name);
    if (!manifest.dependencies || manifest.dependencies[name] !== manifest.version) {
      throw new Error(`${name}: dependency must equal the umbrella version`);
    }
  }
  return '3 rows';
});

check('versions: VERSION.txt matches every manifest', () => {
  const version = read('VERSION.txt').trim();
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('VERSION.txt is not semver: ' + version);
  const root = JSON.parse(read('package.json'));
  if (root.version !== version) throw new Error(`root: ${root.version} != ${version}`);
  for (const { dir } of PLUGINS) {
    const { version: pluginVersion } = JSON.parse(read(`plugins/${dir}/package.json`));
    if (pluginVersion !== version) throw new Error(`${dir}: ${pluginVersion} != ${version}`);
  }
  return version;
});

check('template: placeholder set', () => {
  const template = read('src/parallax-bg/client.template.js');
  for (const token of [...IMAGE_TOKENS, '__LIVE2D_ASSETS__']) {
    const hits = template.split(token).length - 1;
    if (hits !== 1) throw new Error(`${token}: expected 1 occurrence, found ${hits}`);
  }
  if (!template.includes("window.__ModuleLoader__.load({")) throw new Error('missing ModuleLoader wrapper');
  return `${IMAGE_TOKENS.length + 1} placeholders`;
});

check('bundle: not committed to git', () => {
  const built = path.join(ROOT, 'plugins/parallax-bg/client.js');
  if (fs.existsSync(built)) {
    const tracked = spawnSync('git', ['-C', ROOT, 'ls-files', '--error-unmatch', 'plugins/parallax-bg/client.js'], { encoding: 'utf8' });
    if (tracked.status === 0) throw new Error('plugins/parallax-bg/client.js is tracked by git; it must stay a build artifact');
    return 'present locally but ignored';
  }
  return 'absent';
});

check('build: missing inputs fail cleanly', () => {
  if (fs.existsSync(path.join(ROOT, 'assets')) && fs.existsSync(path.join(ROOT, 'vendor'))) {
    const run = spawnSync(process.execPath, [path.join(ROOT, 'tools/build-parallax.mjs'), '--out', path.join(ROOT, 'dist/ci-client.js')], { encoding: 'utf8' });
    if (run.status !== 0) throw new Error('build failed: ' + (run.stderr || '').trim().split('\n')[0]);
    return 'built with local inputs';
  }
  const run = spawnSync(process.execPath, [path.join(ROOT, 'tools/build-parallax.mjs'), '--out', path.join(ROOT, 'dist/ci-client.js')], { encoding: 'utf8' });
  if (run.status === 0) throw new Error('build unexpectedly succeeded without assets/ and vendor/');
  if (!/Missing build inputs/.test(run.stderr || '')) throw new Error('unhelpful error: ' + (run.stderr || '').trim().split('\n')[0]);
  return 'exits 1 with a clear message';
});

let failures = 0;
for (const result of results) {
  const status = result.ok ? 'PASS' : 'FAIL';
  if (!result.ok) failures += 1;
  console.log(`${status}  ${result.name}${result.detail ? '  (' + result.detail + ')' : ''}`);
}
console.log(`\nchecks=${results.length} failures=${failures}`);
process.exitCode = failures ? 1 : 0;
