#!/usr/bin/env node
// 打离线安装包：stage → manifest.json + checksums.txt → payload.zip → 用 csc 编出单文件 Setup.exe。
// 用法：
//   node tools/build-installer.mjs                 # 本体 + 增强包，出 exe 和 zip
//   node tools/build-installer.mjs --packs core    # 只要本体
//   node tools/build-installer.mjs --zip-only      # 只出传统 zip
//   node tools/build-installer.mjs --no-exe        # stage + zip，不编译
// 环境变量：DSH_HOME（默认 ~/.dsh）、EXV_WORKLOAD（默认 C:\DSH Workload）

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const DSH_HOME = process.env.DSH_HOME || path.join(os.homedir(), '.dsh');
const WORKLOAD = process.env.EXV_WORKLOAD || 'C:\\DSH Workload';

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const only = (arg('--packs', 'core,visual')).split(',').map((s) => s.trim()).filter(Boolean);
const stageDir = path.resolve(ROOT, arg('--stage', '_build/installer'));
const outDir = path.resolve(ROOT, arg('--out', 'dist'));
const SKIP_FILES = new Set(['client.template.js', '.DS_Store', 'Thumbs.db']);
const SKIP_DIRS = new Set(['node_modules', '.git', '.github', '.vscode']);
/* --name / --version：打「增强包单独 zip」时用（本体 VERSION.txt 与增强包版本不同）。
   例：--packs visual --zip-only --name DSH-EXV-Visual --version 1.0.0 */
const productName = arg('--name', 'DSH-EXV-Theme');

const version = (arg('--version', '') || fs.readFileSync(path.join(ROOT, 'VERSION.txt'), 'utf8')).trim();
if (!version) throw new Error('VERSION.txt 为空');

const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/packs.build.json'), 'utf8'));
const expand = (p) => p.replace('${DSH_HOME}', DSH_HOME).replace('${WORKLOAD}', WORKLOAD);

const packs = config.packs
  /* 只按显式清单筛：这样 --packs visual 能打出「只有增强包」的 zip，
     不会被 required 的核心包强行带进来。 */
  .filter((p) => only.includes(p.group) || only.includes(p.id))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

function log(msg) { console.log('[build] ' + msg); }
function fail(msg) { console.error('[build] 失败：' + msg); process.exit(1); }

// ---- 1. 校验源目录与版本 ----------------------------------------------------
const rows = [];
for (const pack of packs) {
  const src = expand(pack.source);
  if (!fs.existsSync(src)) fail(`找不到包源目录：${src}（${pack.title}）`);
  const pkgPath = path.join(src, 'package.json');
  if (!fs.existsSync(pkgPath)) fail(`包源缺少 package.json：${src}`);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.name !== pack.bundle) {
    fail(`包名不一致：${src} 的 name=${pkg.name}，配置里是 ${pack.bundle}`);
  }
  rows.push({ ...pack, src, pkg, packVersion: pkg.version || '0.0.0' });
  log(`${pack.title.padEnd(8)} ${pkg.name}@${pkg.version}`);
}

// ---- 2. stage ---------------------------------------------------------------
if (fs.existsSync(stageDir)) fs.rmSync(stageDir, { recursive: true, force: true });
fs.mkdirSync(stageDir, { recursive: true });
fs.mkdirSync(path.join(stageDir, 'packs'), { recursive: true });

const copyTree = (from, to) => {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    if (entry.name.endsWith('.old')) continue;
    if (entry.name.startsWith('package.json.pre-exv')) continue;
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyTree(s, d);
    else if (entry.isFile()) {
      if (SKIP_FILES.has(entry.name)) continue;
      fs.copyFileSync(s, d);
    }
  }
};

for (const pack of rows) {
  const rel = `packs/${pack.group}/${pack.id}`;
  copyTree(pack.src, path.join(stageDir, rel));
  pack.rel = rel;
  log(`stage ${rel}`);
}

// 引擎脚本跟着走（安装器执行的就是这两份，保持与仓库同一份）
// .ps1 必须是 UTF-8 with BOM，否则 PowerShell 5.1 按 GBK 解析中文会直接报语法错。
for (const file of ['install.ps1', 'uninstall.ps1']) {
  let text = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  fs.writeFileSync(path.join(stageDir, file), '\ufeff' + text, 'utf8');
}

// ---- 3. manifest.json -------------------------------------------------------
const manifest = {
  product: config.product,
  version,
  testedDshVersions: config.testedDshVersions || [],
  packs: rows.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    group: p.group,
    source: p.rel,
    folder: p.folder,
    bundle: p.bundle,
    dependency: p.bundle,
    version: p.packVersion,
    required: !!p.required,
    default: !!p.default,
  })),
};
fs.writeFileSync(path.join(stageDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

// ---- 4. checksums.txt ------------------------------------------------------
const listFiles = (dir, base = '') => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...listFiles(p, rel));
    else out.push(rel);
  }
  return out;
};
const payloadFiles = listFiles(path.join(stageDir, 'packs')).sort();
const lines = [`# ${config.product} ${version} payload checksums`, '# format: <sha256>  <path relative to the package root>'];
for (const rel of payloadFiles) {
  const buf = fs.readFileSync(path.join(stageDir, 'packs', rel));
  lines.push(`${crypto.createHash('sha256').update(buf).digest('hex')}  packs/${rel}`);
}
fs.writeFileSync(path.join(stageDir, 'checksums.txt'), lines.join('\n') + '\n', 'utf8');
log(`checksums: ${payloadFiles.length} 个文件`);

// ---- 5. ui.txt（给 exe 的界面读，避免在 C# 里解析 JSON）---------------------
const sizeOf = (dir) => {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    total += entry.isDirectory() ? sizeOf(p) : fs.statSync(p).size;
  }
  return total;
};
const fmtSize = (bytes) =>
  bytes < 1048576 ? Math.max(1, Math.round(bytes / 1024)) + ' KB' : (bytes / 1048576).toFixed(1) + ' MB';
const ui = [
  `product|${config.product}`,
  `version|${version}`,
  `dsh|${(config.testedDshVersions || []).join(',')}`,
  ...rows.map((p) => [
    'pack', p.id, p.title, p.description, p.group, p.packVersion,
    p.required ? 1 : 0, p.default ? 1 : 0, fmtSize(sizeOf(path.join(stageDir, p.rel))),
  ].join('|')),
];
fs.writeFileSync(path.join(stageDir, 'ui.txt'), ui.join('\n') + '\n', 'utf8');

// ---- 6. payload.zip（自己写，不依赖外部压缩工具）---------------------------
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();
const crc32 = (buf) => {
  let c = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ CRC_TABLE[(c ^ buf[i]) & 0xff];
  return (c ^ -1) >>> 0;
};

function writeZip(entries, outPath) {
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, 'utf8');
    const deflated = zlib.deflateRawSync(data, { level: 6 });
    const useDeflate = deflated.length < data.length;
    const body = useDeflate ? deflated : data;
    const method = useDeflate ? 8 : 0;
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, nameBuf, body);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0x0800, 8);
    cd.writeUInt16LE(method, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(body.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(offset, 42);
    central.push(Buffer.concat([cd, nameBuf]));
    offset += local.length + nameBuf.length + body.length;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(central.length, 8);
  end.writeUInt16LE(central.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  fs.writeFileSync(outPath, Buffer.concat([...chunks, centralBuf, end]));
}

const payloadEntries = listFiles(stageDir).sort().map((rel) => ({
  name: rel.split(path.sep).join('/'),
  data: fs.readFileSync(path.join(stageDir, rel)),
}));
const payloadPath = path.join(stageDir, 'payload.zip');
writeZip(payloadEntries, payloadPath);
const payloadSize = fs.statSync(payloadPath).size;
log(`payload.zip ${(payloadSize / 1048576).toFixed(2)} MB（${payloadEntries.length} 个文件）`);

fs.mkdirSync(outDir, { recursive: true });
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

// ---- 7. 传统 zip 通道 -------------------------------------------------------
if (!has('--no-zip')) {
  const zipPath = path.join(outDir, `${productName}-${version}.zip`);
  const zipEntries = listFiles(stageDir)
    .filter((rel) => rel !== 'payload.zip')
    .sort()
    .map((rel) => ({ name: rel.split(path.sep).join('/'), data: fs.readFileSync(path.join(stageDir, rel)) }));
  writeZip(zipEntries, zipPath);
  log(`zip   ${zipPath}  ${(fs.statSync(zipPath).size / 1048576).toFixed(2)} MB  sha256 ${sha(zipPath)}`);
}

// ---- 8. csc 编译单文件安装器 -----------------------------------------------
if (!has('--zip-only') && !has('--no-exe')) {
  const cscCandidates = [
    'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe',
    'C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe',
  ];
  const csc = cscCandidates.find((p) => fs.existsSync(p));
  if (!csc) fail('找不到 csc.exe（需要 .NET Framework 4.x）');
  const setupSrc = path.join(ROOT, 'installer/Setup.cs');
  if (!fs.existsSync(setupSrc)) fail('缺少 installer/Setup.cs');
  const iconPath = path.join(ROOT, 'installer/exv.ico');
  // exe 默认落在 _build/out：发布版要等封包节点再手动放进 dist（vv 2026-11-18 定的规矩）。
  const exeOut = path.resolve(ROOT, arg('--exe-out', '_build/out'));
  fs.mkdirSync(exeOut, { recursive: true });
  const exePath = path.join(exeOut, `${productName}-${version}-Setup.exe`);
  const compileArgs = [
    '/nologo', '/target:winexe', '/optimize+', '/codepage:65001',
    `/out:${exePath}`,
    '/r:System.dll', '/r:System.Drawing.dll', '/r:System.Windows.Forms.dll',
    '/r:System.IO.Compression.dll', '/r:System.IO.Compression.FileSystem.dll',
    `/resource:${payloadPath},payload.zip`,
    `/resource:${path.join(stageDir, 'ui.txt')},ui.txt`,
  ];
  if (fs.existsSync(iconPath)) compileArgs.push(`/win32icon:${iconPath}`);
  compileArgs.push(setupSrc);
  log('csc 编译中……');
  const started = Date.now();
  try {
    execFileSync(csc, compileArgs, { stdio: 'inherit' });
  } catch (error) {
    fail('csc 编译失败');
  }
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  log(`exe   ${exePath}  ${(fs.statSync(exePath).size / 1048576).toFixed(2)} MB  sha256 ${sha(exePath)}  (${seconds}s)`);
}

log('完成');
