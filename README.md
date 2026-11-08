# DSH EXV Theme 2.0

适用于 Windows 上全新安装的 **DeepSeek Harness** 客户端。主题完全自包含，不依赖外部资源服务或本机固定路径。

## 包含内容

- `cyan-theme`：黑色 + 青色 HUD 界面、背景编辑面板、组件、桌面模式、透明预设卡片
- `parallax-bg`：视差背景、代码雨、15 个 Live2D 动态预设、入场/待机、模型缓存、帧率/密度/分辨率设置
- `flat-corners`：去除界面圆角

<img width="2560" height="1440" alt="无标题-tuya" src="https://github.com/user-attachments/assets/81479d15-ee22-496d-b08e-70d3425adbcf" /><img width="1164" height="761" alt="无标题-tuya" src="https://github.com/user-attachments/assets/6776baa6-0037-4aa7-81f3-ddfd19eb3fd9" />
<img width="1164" height="540" alt="无标题-tuya" src="https://github.com/user-attachments/assets/ebb79364-d4fb-4806-9ea1-cc9436a773c1" />
<img width="808" height="809" alt="无标题-tuya" src="https://github.com/user-attachments/assets/cb75588d-ba86-4986-bd5e-2e9e56d4cd84" />

## 系统要求

- Windows 10 / 11（x64）
- DeepSeek Harness 桌面端 **0.2.2-rc.1**（本版本只在该版本上验证过）
- 主题依赖宿主的内部结构（DOM 标记与类名），DSH 升级后可能需要更新主题

## 安装前

1. 先启动一次 DSH 客户端，完成初始化，看到主界面即可；
2. **完全退出 DSH**（托盘也退出）；
3. 解压本安装包到任意目录。

## 一键安装

双击 **`install.cmd`**。

它会自动：

1. 将三个插件复制到 `%USERPROFILE%\.dsh\plugins`；
2. 备份并更新 `%USERPROFILE%\.dsh\profiles\desktop\package.json`；
3. 使用 DSH 自带的 Node/pnpm 安装并链接插件；
4. 如果 DSH 正在运行，会先关闭，安装完成后重新启动。

也可以手动运行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1
```

安装器的行为约定：

- 关闭 DSH 时先尝试正常退出（最多等 6 秒），仍不退出才强制结束；未保存的会话不会自动保存；
- 修改 profile 前会备份，备份文件保留最近 3 份；
- 任何一步失败都会回滚到安装前的状态；
- 若检测到的 DSH 版本与已验证版本不一致，会中止并提示加 `-Force` 继续。

## 卸载

双击 **`uninstall.cmd`**，会移除三个插件、profile 依赖和 bundle 列表。主题的界面配置仍保留在 DSH 的 localStorage 中。

## 默认配置

- 动态模型帧率：120（可改 30/60/90/120）
- 代码雨帧率：60（可改 30/60）
- 代码雨渲染分辨率：2K（可改 720P / 1K / 2K）
- 代码雨密度 / 下落速度：100% / 100%
- 拖拽照明强度：100%（滑条居中）
- 暂停策略：仅页面最小化时暂停；切到其他窗口继续运行

## 从源码构建

仓库里的 `plugins/parallax-bg/client.js` 是构建产物，体积约 40 MB，**不进入 git**，只随 Release 分发。
因此从仓库 "Download ZIP" 得到的是**源码包**，直接运行 `install.cmd` 会缺少 `parallax-bg` 的运行时文件。

需要自行构建时见 [BUILDING.md](BUILDING.md)：准备好 `assets/`（图片与 Live2D 模型）和 `vendor/`（Cubism Core / Pixi / cubism4）后运行

```bash
node tools/build-parallax.mjs
```

## 已知限制

- 3 个 M4 模型（M4 SOPMOD II 4507 N/D、M4 SOPMOD II MOD）本身缺少眼动参数，设置面板会自动隐藏眼动开关；
- 首次加载与冷切换模型需要解码资源，会有一瞬间卡顿；已切换过的模型（LRU 2）可秒切；
- 代码雨与 Live2D 都是实时渲染，2K + 120 帧对集成显卡有压力，可在面板里降档；
- 桌面模式只隐藏主对话流，输入框仍然保留。

## 故障排查

- **提示找不到 desktop profile**：先启动一次 DSH 再关闭重试。
- **提示 pnpm 失败但安装继续**：安装器会自动回退为目录联接；重启 DSH 即可。
- **没有看到主题**：确认 DSH 已完全退出后重开；必要时在 DSH 的“设置 → 插件”里确认三个 `@local` 插件已启用。
- **杀毒软件拦截 PowerShell**：允许本次脚本执行，或右键 `install.ps1` → 使用 PowerShell 运行。
- **提示 DSH 版本不符**：安装器只验证过 `0.2.2-rc.1`。确认要继续，请手动加 `-Force`：
  `powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1 -Force`
- **安装中途失败**：安装器会自动回滚到安装前状态；profile 备份位于 `%USERPROFILE%\.dsh\profiles\desktop\package.json.pre-exv-*.bak`。
- **从仓库下载的 ZIP 装不完整**：仓库 ZIP 不含 40 MB 的 `client.js`，请改用 [Releases](../../releases) 里的 `DSH-EXV-Theme-2.0.zip`。

## 许可证与第三方组件

- 本项目自写的代码采用 [MIT](LICENSE) 许可；
- `parallax-bg` 内嵌的 **Live2D Cubism Core**、**pixi.js**、**pixi-live2d-cubism4** 以及《少女前线》的模型素材，各自遵循其原始授权，**不在 MIT 授权范围内**，详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)；
- 本项目是爱好者作品，与 Sunborn / MICA Team / Live2D 株式会社没有隶属或授权关系；模型素材仅供学习与个人测试，请勿用于商业用途。

## 反馈

有问题或建议请开 Issue，并尽量附上：DSH 版本、Windows 版本、使用的是 Release 包还是源码自建、以及 `install.ps1` 的完整输出。

版本：2.0.1
