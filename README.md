# DSH EXV Theme 2.0

适用于 Windows 上全新安装的 **DeepSeek Harness** 客户端。主题完全自包含，不依赖外部资源服务或本机固定路径。

## 包含内容

- `cyan-theme`：黑色 + 青色 HUD 界面、背景编辑面板、组件、桌面模式、透明预设卡片
- `parallax-bg`：视差背景、代码雨、15 个 Live2D 动态预设、入场/待机、模型缓存、帧率/密度/分辨率设置
- `flat-corners`：去除界面圆角

<img width="2560" height="1440" alt="无标题-tuya" src="https://github.com/user-attachments/assets/81479d15-ee22-496d-b08e-70d3425adbcf" /><img width="1164" height="761" alt="无标题-tuya" src="https://github.com/user-attachments/assets/6776baa6-0037-4aa7-81f3-ddfd19eb3fd9" />
<img width="1164" height="540" alt="无标题-tuya" src="https://github.com/user-attachments/assets/ebb79364-d4fb-4806-9ea1-cc9436a773c1" />
<img width="808" height="809" alt="无标题-tuya" src="https://github.com/user-attachments/assets/cb75588d-ba86-4986-bd5e-2e9e56d4cd84" />

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

## 卸载

双击 **`uninstall.cmd`**，会移除三个插件、profile 依赖和 bundle 列表。主题的界面配置仍保留在 DSH 的 localStorage 中。

## 默认配置

- 动态模型帧率：120（可改 30/60/90/120）
- 代码雨帧率：60（可改 30/60）
- 代码雨渲染分辨率：2K（可改 720P / 1K / 2K）
- 代码雨密度 / 下落速度：100% / 100%
- 拖拽照明强度：100%（滑条居中）
- 暂停策略：仅页面最小化时暂停；切到其他窗口继续运行

## 故障排查

- **提示找不到 desktop profile**：先启动一次 DSH 再关闭重试。
- **提示 pnpm 失败但安装继续**：安装器会自动回退为目录联接；重启 DSH 即可。
- **没有看到主题**：确认 DSH 已完全退出后重开；必要时在 DSH 的“设置 → 插件”里确认三个 `@local` 插件已启用。
- **杀毒软件拦截 PowerShell**：允许本次脚本执行，或右键 `install.ps1` → 使用 PowerShell 运行。

版本：2.0.0
