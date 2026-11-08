#!/usr/bin/env node
/**
 * Build plugins/parallax-bg/client.js from src/parallax-bg/client.template.js.
 *
 * The plugin bundle must stay self-contained at runtime: the Live2D runtime
 * (Cubism Core + Pixi + cubism4 display), every static image and all model
 * data are inlined as data URLs. Nothing is fetched from the network or from
 * the host app's asset routes.
 *
 * The build inputs are NOT part of this repository (they carry third-party
 * licenses — see THIRD_PARTY_NOTICES.md), so you have to provide them:
 *
 *   assets/
 *     background.webp  logo.webp  wordmark.webp  vv.webp
 *     chips.webp  cyberpunk.webp  starsky.webp  frankfurt.webp
 *     vv-scarh.webp  vv-hk416.webp  vv-scarl.webp  vv-ump45.webp
 *     vv-vector.webp  vv-ak12.webp  vv-m200.webp  vv-ak74m.webp
 *     live2d/
 *       manifest.json
 *       <model-id>/model3.json
 *       <model-id>/<textures...>
 *       <model-id>/motions/*.motion3.json
 *       <model-id>/<physics...>            (optional)
 *
 *   vendor/
 *     live2dcubismcore.min.js
 *     pixi.min.js                          (6.5.x)
 *     pixi-live2d-cubism4.min.js           (1.3.x)
 *
 * Usage:
 *   node tools/build-parallax.mjs
 *   node tools/build-parallax.mjs --assets ./assets --runtime ./vendor
 *   node tools/build-parallax.mjs --out /tmp/client.js --quiet
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Assets inlined into the ASSETS map, in template order. */
const IMAGES = [
  ['background', 'background.webp', '__BACKGROUND__'],
  ['logo', 'logo.webp', '__LOGO__'],
  ['wordmark', 'wordmark.webp', '__WORDMARK__'],
  ['vv', 'vv.webp', '__VV__'],
  ['chips', 'chips.webp', '__CHIPS__'],
  ['cyberpunk', 'cyberpunk.webp', '__CYBERPUNK__'],
  ['starsky', 'starsky.webp', '__STARSKY__'],
  ['frankfurt', 'frankfurt.webp', '__FRANKFURT__'],
  ['vvScarh', 'vv-scarh.webp', '__VV_SCARH__'],
  ['vvHk416', 'vv-hk416.webp', '__VV_HK416__'],
  ['vvScarl', 'vv-scarl.webp', '__VV_SCARL__'],
  ['vvUmp45', 'vv-ump45.webp', '__VV_UMP45__'],
  ['vvVector', 'vv-vector.webp', '__VV_VECTOR__'],
  ['vvAk12', 'vv-ak12.webp', '__VV_AK12__'],
  ['vvM200', 'vv-m200.webp', '__VV_M200__'],
  ['vvAk74m', 'vv-ak74m.webp', '__VV_AK74M__'],
];

const RUNTIME = ['live2dcubismcore.min.js', 'pixi.min.js', 'pixi-live2d-cubism4.min.js'];
const BOOTSTRAP =
  ";try{if(typeof window!=='undefined'){if(typeof Live2DCubismCore!=='undefined')window.Live2DCubismCore=Live2DCubismCore;if(typeof PIXI!=='undefined')window.PIXI=PIXI;}}catch(e){}";

function usage(exitCode = 0) {
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0].replace(/^#!.*\n/, ''));
  process.exit(exitCode);
}

const args = process.argv.slice(2);
const opts = {
  assets: path.join(ROOT, 'assets'),
  runtime: path.join(ROOT, 'vendor'),
  out: path.join(ROOT, 'plugins/parallax-bg/client.js'),
  quiet: false,
  template: path.join(ROOT, 'src/parallax-bg/client.template.js'),
};
for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  const value = () => {
    const next = args[i + 1];
    if (!next || next.startsWith('--')) throw new Error(`${arg} needs a value`);
    i += 1;
    return next;
  };
  switch (arg) {
    case '--assets': opts.assets = path.resolve(value()); break;
    case '--runtime': opts.runtime = path.resolve(value()); break;
    case '--out': opts.out = path.resolve(value()); break;
    case '--template': opts.template = path.resolve(value()); break;
    case '--quiet': opts.quiet = true; break;
    case '-h':
    case '--help': usage(0); break;
    default: throw new Error(`unknown argument: ${arg}`);
  }
}

const missing = [];
const need = (file) => { if (!fs.existsSync(file)) missing.push(file); return file; };

need(opts.template);
for (const [, file] of IMAGES) need(path.join(opts.assets, file));
for (const file of RUNTIME) need(path.join(opts.runtime, file));
const manifestPath = need(path.join(opts.assets, 'live2d/manifest.json'));
if (missing.length) {
  console.error('Missing build inputs:');
  for (const file of missing) console.error('  - ' + path.relative(ROOT, file));
  console.error('\nSee the header of tools/build-parallax.mjs for the expected layout.');
  process.exit(1);
}

const log = (message) => { if (!opts.quiet) console.log(message); };

/* --- inline the static images ------------------------------------------- */
let template = fs.readFileSync(opts.template, 'utf8');
if (!template.includes('__LIVE2D_ASSETS__')) throw new Error('template is missing __LIVE2D_ASSETS__');
for (const [, file, token] of IMAGES) {
  if (!template.includes(token)) throw new Error('template is missing placeholder ' + token);
  const base64 = fs.readFileSync(path.join(opts.assets, file)).toString('base64');
  template = template.split(token).join(base64);
}

/* --- inline the Live2D model data --------------------------------------- */
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const live2dRoot = path.join(opts.assets, 'live2d');
const toBase64 = (relative) => fs.readFileSync(path.join(live2dRoot, relative)).toString('base64');
const live2dAssets = {};
for (const model of manifest) {
  const settings = JSON.parse(fs.readFileSync(path.join(live2dRoot, model.model3), 'utf8'));
  const motions = {};
  for (const name of model.motions || []) {
    const source = fs.readFileSync(path.join(live2dRoot, model.id, 'motions', name));
    if (name === model.entranceName) {
      /* Entrance plays exactly once: force Loop=false in the embedded Meta. */
      const motion = JSON.parse(source.toString('utf8'));
      motion.Meta = motion.Meta || {};
      motion.Meta.Loop = false;
      motions[name] = Buffer.from(JSON.stringify(motion)).toString('base64');
    } else {
      motions[name] = source.toString('base64');
    }
  }
  const motionRefs = (settings.FileReferences || {}).Motions || {};
  const readMeta = (name) => {
    if (!name) return null;
    try {
      return JSON.parse(fs.readFileSync(path.join(live2dRoot, model.id, 'motions', name), 'utf8')).Meta || null;
    } catch {
      return null;
    }
  };
  const findMotion = (name) => {
    if (!name) return null;
    for (const [group, list] of Object.entries(motionRefs)) {
      for (let index = 0; index < list.length; index += 1) {
        const file = list[index] && list[index].File ? list[index].File : '';
        if (file.split(/[\\/]/).pop() === name) return { group, index };
      }
    }
    return null;
  };
  const idleMeta = readMeta(model.idleName);
  const entranceMeta = readMeta(model.entranceName);
  live2dAssets[model.id] = {
    settings,
    moc3: toBase64(model.moc3),
    textures: (model.textures || []).map(toBase64),
    motion: toBase64(model.motion),
    motions,
    entrance: findMotion(model.entranceName),
    idle: findMotion(model.idleName) || findMotion('daiji_idle_01.motion3.json') || { group: '', index: 0 },
    idleDuration: idleMeta && Number.isFinite(idleMeta.Duration) ? idleMeta.Duration : 8,
    entranceDuration: entranceMeta && Number.isFinite(entranceMeta.Duration) ? entranceMeta.Duration : 3,
    physics: model.physics ? toBase64(model.physics) : null,
  };
}
template = template.split('__LIVE2D_ASSETS__').join(JSON.stringify(live2dAssets));

/* --- prepend the Live2D runtime ----------------------------------------- */
const runtime = RUNTIME.map((file) => fs.readFileSync(path.join(opts.runtime, file), 'utf8')).join('\n;\n');
const built = runtime + '\n;\n' + BOOTSTRAP + '\n' + template;

/* Only the build tokens matter — identifiers such as window.__DSH_EXV__ are
   legitimate runtime globals and must not be treated as placeholders. */
for (const token of [...IMAGES.map((entry) => entry[2]), '__LIVE2D_ASSETS__']) {
  if (template.includes(token)) throw new Error('unresolved placeholder left in the bundle: ' + token);
}

fs.mkdirSync(path.dirname(opts.out), { recursive: true });
fs.writeFileSync(opts.out, built);

const sha256 = crypto.createHash('sha256').update(fs.readFileSync(opts.out)).digest('hex');
const relative = path.relative(ROOT, opts.out);
log(`built ${relative.startsWith('..') ? opts.out : relative}`);
log(`  models : ${manifest.length}`);
log(`  bytes  : ${Buffer.byteLength(built)}`);
log(`  sha256 : ${sha256}`);
