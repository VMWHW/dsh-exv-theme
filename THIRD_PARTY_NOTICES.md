# 第三方组件与素材声明 / Third-Party Notices

本仓库**自写的代码**采用 MIT 许可证（见 [LICENSE](LICENSE)）。
下列第三方组件与素材**不在 MIT 授权范围内**，其版权与使用条件归各自权利人所有。

## 0. 适用范围 / Scope

MIT 只覆盖本项目自写的源代码、构建脚本与文档；**不覆盖**插件产物里内嵌的第三方组件与角色素材，尤其包括：Live2D Cubism Core、pixi.js、pixi-live2d-cubism4，以及《少女前线》的模型与美术素材。它们仍归各自权利人所有，不在 MIT 下再授权。

> 这一段原先附在 LICENSE 末尾，导致 GitHub 把整个仓库识别为 "Other / NOASSERTION"；现在只保留纯 MIT 正文，适用范围放在这里。

---

## 1. Live2D Cubism Core

- **内嵌位置**：`plugins/parallax-bg/client.js`（压缩后的 `Live2DCubismCore`）
- **版权**：`(C) 2019 Live2D Inc. All rights reserved.`
- **许可**：Live2D Proprietary Software License Agreement（专有软件许可协议）
- **协议全文**：<https://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html>
- **文件内声明**：该文件对应协议中的 "Redistributable Code"（可再分发代码），授权声明原文保留在打包产物中，**请勿删除或修改**。

使用与再分发时请注意（依据上述协议）：

- 不得删除或改写产物中 Live2D 的版权、商标与许可声明（6.1 条）；
- 不得对再分发代码适用 MIT 等「开放源码类许可证」（协议 5.3.2 条所指的 excluded license）；
- 再分发需遵守协议的 5.2 条（保留主要功能、要求下游接受同等保护、原样再分发等）；
- 如将本项目用于公开分发的衍生作品，请自行确认是否需要与 Live2D 签订「出版许可协议」；个人、小规模事业者与教育机构在协议 2.2 条下有豁免条件，具体以协议原文为准。

---

## 2. pixi.js

- **版本**：v6.5.10
- **内嵌位置**：`plugins/parallax-bg/client.js`
- **许可**：MIT License
- **版权**：Copyright (c) 2015-2021 Mat Groves / Goodboy Digital
- 产物内保留了原始 MIT 许可 banner。
- 项目主页：<https://github.com/pixijs/pixijs>

---

## 3. pixi-live2d-cubism4

- **版本**：1.3.2
- **内嵌位置**：`plugins/parallax-bg/client.js`
- **许可**：MIT License
- **作者**：guansss
- 项目主页：<https://github.com/guansss/pixi-live2d-cubism4>

---

## 4. Live2D 模型与角色素材

- **素材内容**：15 套 Live2D 模型（`.moc3`、WebP 贴图、全部 `motion3.json` 动作、`physics3.json`），内嵌于 `plugins/parallax-bg/client.js`。
- **来源**：手机游戏《少女前线》（Girls' Frontline）。
- **权利归属**：角色形象与模型资产版权归**上海散爆网络科技有限公司（Sunborn Network Technology）**及相关权利人所有。
- **使用范围**：本项目将其用于**学习、研究与个人测试**，**禁止任何商业用途**。
- **非官方声明**：本项目为爱好者作品，与 Sunborn / MICA Team / 云母组 **无任何隶属、授权或背书关系**。

---

## 5. 其他图像素材

`plugins/` 内嵌的背景图、LOGO、角色立绘与缩略图同样来自上述作品的公开素材，仅用于个人学习与展示，版权归原权利人所有。

---

## 6. 再分发提示

如果你 fork、镜像或二次分发本项目：

1. 请完整保留本文件与 `LICENSE`；
2. 不要把 Live2D 模型素材用于商业产品或公开商业分发；
3. 不要删除打包产物中的第三方版权与许可声明。

如权利人认为本仓库中的任何素材存在不妥，请通过 Issue 联系，确认后会尽快移除相关内容。
