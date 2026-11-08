# 构建说明 / Building from source

> **普通用户不需要构建。** 直接到 [Releases](../../releases) 下载 `DSH-EXV-Theme-2.0.zip`，解压后双击 `install.cmd` 即可。
> 本文件只面向想修改代码或自行重建 `parallax-bg` 的开发者。

## 仓库结构

```
plugins/                          三个插件的清单与源码
  cyan-theme/client.js            手写源码，可直接阅读与修改
  flat-corners/client.js          手写源码
  parallax-bg/                    只有清单，client.js 是构建产物（不入库）
src/parallax-bg/client.template.js  视差 / 代码雨 / Live2D 的源码（占位符形式）
tools/build-parallax.mjs          把模板 + 资源构建成自包含的 client.js
```

`plugins/parallax-bg/client.js` 约 40 MB，由 `tools/build-parallax.mjs` 生成，**不进入 git**，只随 Release 分发。

## 构建需要自备的输入

因为授权原因，下列文件不在本仓库内（详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)）：

```
assets/
  background.webp  logo.webp  wordmark.webp  vv.webp
  chips.webp  cyberpunk.webp  starsky.webp  frankfurt.webp
  vv-scarh.webp  vv-hk416.webp  vv-scarl.webp  vv-ump45.webp
  vv-vector.webp  vv-ak12.webp  vv-m200.webp  vv-ak74m.webp
  live2d/
    manifest.json
    <model-id>/model3.json
    <model-id>/<textures...>
    <model-id>/motions/*.motion3.json
    <model-id>/<physics...>          （可选）

vendor/
  live2dcubismcore.min.js
  pixi.min.js                        6.5.x
  pixi-live2d-cubism4.min.js         1.3.x
```

## 构建

```bash
node tools/build-parallax.mjs
# 或者指定路径
node tools/build-parallax.mjs --assets ./assets --runtime ./vendor
# 只输出到临时位置做比对
node tools/build-parallax.mjs --out /tmp/client.js
```

脚本会校验每个占位符、内联全部资源，并打印产物大小与 sha256。

## 校验

v2.0 发布产物的基准值：

| 项 | 值 |
| --- | --- |
| 大小 | 40,186,396 字节 |
| sha256 | `c566f538b627f91cb56d28dad737262fa1621b89412f42dc3811533221708f8b` |

重建后哈希一致，说明你的输入资源与官方构建所用的完全一致。

其余两个插件不需要构建，但仍建议做语法检查：

```bash
node --check plugins/cyan-theme/client.js
node --check plugins/flat-corners/client.js
```

## 注意

- 仓库根目录的 `install.cmd` / `install.ps1` 期望同级存在完整的 `plugins/`；从源码目录直接安装前必须先构建，否则 `parallax-bg` 会缺少 `client.js`。
- 打包发布时请使用 Release 里的 zip，不要直接把源码目录压缩分发。
