// DSH EXV Theme 离线安装器（单文件 exe 引导器）
// 由 tools/build-installer.mjs 用 csc 编译，payload.zip 与 ui.txt 以内嵌资源形式带进来。
// 设计口径：黑底 + 主题青 + 方角，和主题本体同一套视觉语言；不做 Windows 卸载项。
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;

static class Program
{
    [STAThread]
    static void Main(string[] rawArgs)
    {
        bool silent = false, noBoot = false, uninstallMode = false, autoInstall = false;
        string packArg = null;
        string selftest = null;
        string homeArg = null;
        foreach (string a in rawArgs)
        {
            if (a.Equals("/S", StringComparison.OrdinalIgnoreCase)) silent = true;
            else if (a.Equals("/UNINSTALL", StringComparison.OrdinalIgnoreCase)) uninstallMode = true;
            else if (a.Equals("/AUTOINSTALL", StringComparison.OrdinalIgnoreCase)) autoInstall = true;
            else if (a.Equals("/NOBOOT", StringComparison.OrdinalIgnoreCase)) noBoot = true;
            else if (a.StartsWith("/PACKS=", StringComparison.OrdinalIgnoreCase)) packArg = a.Substring(7);
            else if (a.StartsWith("/SELFTEST=", StringComparison.OrdinalIgnoreCase)) selftest = a.Substring(10);
            else if (a.StartsWith("/DSHHOME=", StringComparison.OrdinalIgnoreCase)) homeArg = a.Substring(9);
        }
        try { SetProcessDPIAware(); } catch { }
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);

        Ui.Manifest ui = Ui.Manifest.Load();
        if (selftest != null)
        {
            List<string> lines = new List<string>();
            lines.Add("product=" + ui.Product);
            lines.Add("version=" + ui.Version);
            lines.Add("dsh=" + ui.Dsh);
            foreach (Ui.PackInfo p in ui.Packs)
                lines.Add("pack=" + p.Id + "|" + p.Title + "|" + p.Version + "|" + p.SizeMb + "|" + (p.Required ? 1 : 0) + "|" + (p.Default ? 1 : 0));
            lines.Add("payload=" + (Assembly.GetExecutingAssembly().GetManifestResourceStream("payload.zip") != null ? "ok" : "missing"));
            try { File.WriteAllLines(selftest, lines.ToArray(), new UTF8Encoding(false)); } catch { }
            return;
        }
        if (silent && uninstallMode)
        {
            Ui.Installer.Extract(Path.Combine(Path.GetTempPath(), "dsh-exv-setup-" + Process.GetCurrentProcess().Id), null);
            List<string> allIds = new List<string>();
            foreach (Ui.PackInfo pack in ui.Packs) allIds.Add(pack.Id);
            Ui.Installer.RunScript("uninstall.ps1", allIds, null, null, homeArg);
            return;
        }
        if (silent)
        {
            Ui.Installer.TryTrace("silent start packs=" + ui.Packs.Count + " home=" + (homeArg == null ? "null" : homeArg));
            bool ok = Ui.Installer.Run(ui, ui.DefaultPackIds(), true, null, null, homeArg);
            if (ok && !noBoot) Ui.Installer.LaunchDsh();
            return;
        }
        Application.Run(new Ui.SetupForm(ui, packArg, homeArg, autoInstall));
    }

    [DllImport("user32.dll")]
    public static extern bool SetProcessDPIAware();
}

namespace Ui
{
    // ---- 清单 ---------------------------------------------------------------
    public class PackInfo
    {
        public string Id, Title, Desc, Group, Version, SizeMb;
        public bool Required, Default;
    }

    public class Manifest
    {
        public string Product = "DSH EXV Theme";
        public string Version = "";
        public string Dsh = "";
        public List<PackInfo> Packs = new List<PackInfo>();

        public static Manifest Load()
        {
            Manifest m = new Manifest();
            using (Stream s = Assembly.GetExecutingAssembly().GetManifestResourceStream("ui.txt"))
            {
                if (s == null) return m;
                using (StreamReader r = new StreamReader(s, Encoding.UTF8))
                {
                    string line;
                    while ((line = r.ReadLine()) != null)
                    {
                        if (line.Length == 0) continue;
                        string[] f = line.Split('|');
                        if (f[0] == "product") m.Product = f[1];
                        else if (f[0] == "version") m.Version = f[1];
                        else if (f[0] == "dsh") m.Dsh = f[1];
                        else if (f[0] == "pack")
                        {
                            PackInfo p = new PackInfo();
                            p.Id = f[1]; p.Title = f[2]; p.Desc = f[3]; p.Group = f[4];
                            p.Version = f[5];
                            p.Required = f[6] == "1"; p.Default = f[7] == "1";
                            p.SizeMb = f.Length > 8 ? f[8] : "";
                            m.Packs.Add(p);
                        }
                    }
                }
            }
            return m;
        }

        public List<string> DefaultPackIds()
        {
            List<string> ids = new List<string>();
            foreach (PackInfo p in Packs) if (p.Required || p.Default) ids.Add(p.Id);
            return ids;
        }
    }

    // ---- 调色板 -------------------------------------------------------------
    static class Palette
    {
        public static readonly Color Bg = Color.FromArgb(4, 7, 10);
        public static readonly Color Panel = Color.FromArgb(9, 14, 18);
        public static readonly Color Accent = Color.FromArgb(0, 255, 240);
        public static readonly Color Text = Color.FromArgb(232, 248, 250);
        public static readonly Color Dim = Color.FromArgb(126, 152, 158);
        public static readonly Color Line = Color.FromArgb(0, 255, 240, 48);
        public static Color Alpha(Color c, int a) { return Color.FromArgb(a, c.R, c.G, c.B); }
    }

    // ---- 主窗口 -------------------------------------------------------------
    public class SetupForm : Form
    {
        readonly Manifest ui;
        readonly string dshHome;
        readonly bool autoStart;
        readonly List<string> selected = new List<string>();
        bool bootAfter = false;      // 默认不勾：和主流安装器一致
        bool busy, finished, failed;
        bool finishing, hoverDanger, installed;
        Rectangle rUninstall;
        string status = "准备就绪";
        int step, stepTotal;
        readonly List<string> logLines = new List<string>();
        readonly System.Windows.Forms.Timer pump = new System.Windows.Forms.Timer();
        Rectangle rStart, rClose, rBoot;
        readonly List<KeyValuePair<Rectangle, PackInfo>> rows = new List<KeyValuePair<Rectangle, PackInfo>>();
        int hoverRow = -1;
        bool hoverStart, hoverClose;
        bool hoverUninstall;
        Point dragOffset;
        bool dragging;
        Process running;

        public SetupForm(Manifest m, string presetPacks, string dshHome, bool autoStart)
        {
            ui = m;
            this.dshHome = dshHome;
            this.autoStart = autoStart;
            foreach (PackInfo p in ui.Packs) if (p.Required || p.Default) selected.Add(p.Id);
            if (!string.IsNullOrEmpty(presetPacks))
            {
                selected.Clear();
                foreach (string id in presetPacks.Split(',')) if (id.Trim().Length > 0) selected.Add(id.Trim());
                foreach (PackInfo p in ui.Packs) if (p.Required && !selected.Contains(p.Id)) selected.Add(p.Id);
            }
            FormBorderStyle = FormBorderStyle.None;
            StartPosition = FormStartPosition.CenterScreen;
            ClientSize = new Size(940, 690);
            DoubleBuffered = true;
            BackColor = Palette.Bg;
            Text = ui.Product + " " + ui.Version + " 安装器";
            installed = DetectInstalled();
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);
            pump.Interval = 120;
            pump.Tick += delegate { Pump(); };
        }

        bool HasOptional()
        {
            foreach (PackInfo pack in ui.Packs) if (!pack.Required) return true;
            return false;
        }

        bool DetectInstalled()
        {
            try
            {
                string home = Path.Combine(string.IsNullOrEmpty(dshHome) ? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".dsh") : dshHome, "plugins");
                foreach (PackInfo pack in ui.Packs)
                {
                    string folder = pack.Id == "visual" ? "theme-visual" : pack.Id;
                    if (Directory.Exists(Path.Combine(home, folder))) return true;
                }
            }
            catch { }
            return false;
        }

        Font F(float size, bool bold, bool mono)
        {
            string family = mono ? "Consolas" : "Microsoft YaHei UI";
            float h = mono ? size * 1.06f : size * 1.16f;
            return new Font(family, h, bold ? FontStyle.Bold : FontStyle.Regular, GraphicsUnit.Point);
        }

        string ExeDir
        {
            get
            {
                string dir = Path.Combine(Path.GetTempPath(), "dsh-exv-setup-" + Process.GetCurrentProcess().Id);
                return dir;
            }
        }

        [System.Runtime.InteropServices.DllImport("dwmapi.dll")]
        static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int value, int size);

        protected override void OnHandleCreated(EventArgs e)
        {
            base.OnHandleCreated(e);
            try { int preference = 1; DwmSetWindowAttribute(Handle, 33, ref preference, sizeof(int)); }
            catch { }
        }

        readonly System.Windows.Forms.Timer scanTimer = new System.Windows.Forms.Timer();
        float scanProgress = -1f;

        void StartScanWave()
        {
            scanProgress = 0f;
            scanTimer.Interval = 16;
            scanTimer.Tick += delegate
            {
                scanProgress += 0.022f;
                if (scanProgress >= 1f) { scanProgress = -1f; scanTimer.Stop(); }
                Invalidate();
            };
            scanTimer.Start();
        }

        void DrawSteps(Graphics g, int x, int y)
        {
            string[] steps = { "关闭 DSH", "校验载荷", "复制插件", "更新 profile", "重新链接", "完成" };
            int phase = finished && !failed ? 5 : (step <= 1 ? 0 : (step <= 2 ? 1 : (step <= 3 ? 2 : (step <= 4 ? 3 : 4))));
            float sx = x;
            using (Font sf = F(8.2f, false, true))
            {
                for (int i = 0; i < steps.Length; i++)
                {
                    string label = "0" + (i + 1) + " " + steps[i];
                    bool active = i == Math.Min(phase, steps.Length - 1);
                    if (active)
                    {
                        SizeF size = g.MeasureString(label, sf);
                        using (SolidBrush chip = new SolidBrush(Palette.Alpha(Palette.Accent, 30)))
                            g.FillRectangle(chip, sx - 4, y - 2, size.Width + 8, size.Height + 2);
                        using (SolidBrush on = new SolidBrush(Palette.Accent)) g.DrawString(label, sf, on, sx, y);
                        sx += size.Width + 16;
                    }
                    else
                    {
                        using (SolidBrush off = new SolidBrush(Palette.Alpha(Palette.Dim, 190))) g.DrawString(label, sf, off, sx, y);
                        sx += g.MeasureString(label, sf).Width + 16;
                    }
                }
            }
        }

        void DrawScanWave(Graphics g)
        {
            if (scanProgress < 0f) return;
            float bandH = 90f;
            float y = -bandH + (Height + bandH) * scanProgress;
            using (LinearGradientBrush band = new LinearGradientBrush(
                new Rectangle(0, (int)y, Width, (int)bandH),
                Palette.Alpha(Palette.Accent, 0), Palette.Alpha(Palette.Accent, 30), LinearGradientMode.Vertical))
                g.FillRectangle(band, 0, y, Width, bandH);
            using (LinearGradientBrush tail = new LinearGradientBrush(
                new Rectangle(0, (int)(y + bandH), Width, 16),
                Palette.Alpha(Palette.Accent, 60), Palette.Alpha(Palette.Accent, 0), LinearGradientMode.Vertical))
                g.FillRectangle(tail, 0, y + bandH, Width, 16);
            using (Pen core = new Pen(Palette.Alpha(Palette.Accent, 150), 1f))
                g.DrawLine(core, 0, y + bandH - 1, Width, y + bandH - 1);
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            Graphics g = e.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.Clear(Palette.Bg);

            // 背景网格：和主题同一种 22px 点阵气质
            using (Pen grid = new Pen(Color.FromArgb(9, 0, 255, 240), 1))
            {
                for (int x = 0; x < Width; x += 22) g.DrawLine(grid, x, 0, x, Height);
                for (int y = 0; y < Height; y += 22) g.DrawLine(grid, 0, y, Width, y);
            }
            // 外框 + 顶部光带
            using (Pen border = new Pen(Color.FromArgb(96, Palette.Accent), 1))
                g.DrawRectangle(border, 0, 0, Width - 1, Height - 1);
            using (LinearGradientBrush glow = new LinearGradientBrush(
                new Rectangle(0, 0, Width, 3), Palette.Accent, Palette.Alpha(Palette.Accent, 0), LinearGradientMode.Horizontal))
                g.FillRectangle(glow, 1, 1, Width - 2, 2);

            // 品牌行
            DrawSpaced(g, "DSH EXV THEME", 30, 26, F(9.5f, true, true), Palette.Alpha(Palette.Accent, 210), 3.6f);
            using (Font mono = F(9, false, true))
            using (SolidBrush dim = new SolidBrush(Palette.Dim))
                g.DrawString(ui.Version, mono, dim, Width - 92, 25);

            // 关闭按钮
            rClose = new Rectangle(Width - 46, 18, 28, 28);
            using (Font cf = F(11, false, false))
            using (SolidBrush cb = new SolidBrush(hoverClose ? Palette.Accent : Palette.Dim))
                g.DrawString("✕", cf, cb, rClose.X + 5, rClose.Y + 2);

            // 标题
            using (Font title = new Font("Microsoft YaHei UI", 23f, FontStyle.Bold, GraphicsUnit.Point))
            using (SolidBrush white = new SolidBrush(Palette.Text))
                g.DrawString(finished ? (failed ? "安装失败" : "安装完成") : (busy ? "正在安装" : "安装 " + ui.Product), title, white, 28, 58);

            using (Font sub = F(9.5f, false, false))
            using (SolidBrush dim = new SolidBrush(Palette.Dim))
                g.DrawString(busy ? status : (HasOptional() ? "离线一键安装 · 勾选要装的增强包 · 不写入 Windows 卸载项" : "离线一键安装 · 自动装齐三个子插件 · 不写入 Windows 卸载项"), sub, dim, 30, 104);

            // 分割线
            using (Pen line = new Pen(Palette.Line, 1)) g.DrawLine(line, 30, 136, Width - 30, 136);

            if (busy || finished) DrawProgress(g); else DrawPacks(g);

            // 底部
            int by = Height - 88;
            using (Pen line = new Pen(Palette.Line, 1)) g.DrawLine(line, 30, by - 18, Width - 30, by - 18);
            if (!busy && !finished)
            {
                rBoot = new Rectangle(30, by + 8, 380, 26);
                using (Font f = F(9.5f, false, false))
                using (SolidBrush b = new SolidBrush(bootAfter ? Palette.Text : Palette.Dim))
                {
                    DrawCheck(g, new Rectangle(30, by + 12, 16, 16), bootAfter);
                    g.DrawString("安装完成后启动 DSH", f, b, 56, by + 9);
                }
            }
            rUninstall = new Rectangle(Width - 342, by + 2, 120, 44);
            if (!busy && installed) DrawDanger(g, rUninstall, finishing ? "卸载中…" : "一键卸载", !finishing, hoverUninstall);
            rStart = new Rectangle(Width - 210, by + 2, 180, 44);
            DrawButton(g, rStart, finished ? (failed ? "关闭" : "完成") : (busy ? "安装中…" : "开始安装"),
                !busy && (finished || selected.Count > 0), hoverStart);

            DrawScanWave(g);

            if (finished)
            {
                using (Font f = F(9, false, false))
                using (SolidBrush b = new SolidBrush(failed ? Color.FromArgb(255, 96, 96) : Palette.Accent))
                    g.DrawString(failed ? "详情见下方日志，可复制后反馈。" : "全部完成。启动 DSH 后主题立即生效。", f, b, 30, by + 14);
            }
        }

        void DrawPacks(Graphics g)
        {
            rows.Clear();
            int y = 158;
            foreach (PackInfo p in ui.Packs)
            {
                Rectangle row = new Rectangle(30, y, Width - 60, 70);
                rows.Add(new KeyValuePair<Rectangle, PackInfo>(row, p));
                bool on = selected.Contains(p.Id);
                bool hot = hoverRow == rows.Count - 1;
                if (on)
                {
                    for (int glow = 6; glow >= 1; glow -= 1)
                        using (Pen halo = new Pen(Palette.Alpha(Palette.Accent, 6 + glow * 2), 1))
                            g.DrawRectangle(halo, row.X - glow, row.Y - glow, row.Width - 1 + glow * 2, row.Height - 1 + glow * 2);
                }
                Color fill = on ? Palette.Alpha(Palette.Accent, 26) : (hot ? Palette.Alpha(Palette.Accent, 12) : Palette.Panel);
                using (SolidBrush bg = new SolidBrush(fill)) g.FillRectangle(bg, row);
                using (Pen edge = new Pen(on ? Color.FromArgb(210, Palette.Accent) : Palette.Alpha(Color.White, 18), on ? 2 : 1))
                    g.DrawRectangle(edge, row.X, row.Y, row.Width - 1, row.Height - 1);

                Rectangle box = new Rectangle(row.X + 16, row.Y + 21, 20, 20);
                DrawCheck(g, box, on);

                using (Font tf = F(11f, true, false))
                using (SolidBrush tb = new SolidBrush(on ? Palette.Text : Palette.Dim))
                {
                    g.DrawString(p.Title, tf, tb, row.X + 52, row.Y + 10);
                    if (p.Required)
                    {
                        SizeF tw = g.MeasureString(p.Title, tf);
                        using (Font lf = F(7.2f, false, true))
                        using (SolidBrush lb = new SolidBrush(Palette.Alpha(Palette.Accent, 150)))
                            g.DrawString("必装", lf, lb, row.X + 52 + tw.Width + 8, row.Y + 15);
                    }
                }
                using (Font df = F(8.8f, false, false))
                using (SolidBrush db = new SolidBrush(Palette.Alpha(Palette.Dim, 220)))
                    g.DrawString(p.Desc, df, db, new RectangleF(row.X + 52, row.Y + 33, row.Width - 190, 22));
                using (Font vf = F(8.5f, false, true))
                using (SolidBrush vb = new SolidBrush(Palette.Alpha(Palette.Accent, 190)))
                {
                    string ver = (p.Group == "core" ? "" : p.Version + " · ") + p.SizeMb;
                    SizeF sz = g.MeasureString(ver, vf);
                    g.DrawString(ver, vf, vb, row.Right - sz.Width - 14, row.Y + 22);
                }
                y += 78;
            }

            using (Font f = F(8.6f, false, false))
            using (SolidBrush b = new SolidBrush(Palette.Alpha(Palette.Dim, 200)))
                g.DrawString(HasOptional() ? "本体三个包为必装项；增强包可自由勾选，之后重跑安装器即可增减。已验证的 DSH 版本：" + ui.Dsh : "三个包会自动全部装上；之后重跑安装器可以修复或卸载。已验证的 DSH 版本：" + ui.Dsh, f, b,
                    new RectangleF(30, y + 2, Width - 60, 34));

            // 流程提示：填掉下方空白，也让人一眼知道安装器会动什么
            string[] steps = { "关闭 DSH", "校验载荷", "复制插件", "更新 profile", "重新链接", "完成" };
            using (Font sf = F(8.2f, false, true))
            {
                float sx = 30, sy = y + 44;
                for (int i = 0; i < steps.Length; i++)
                {
                    using (SolidBrush num = new SolidBrush(Palette.Alpha(Palette.Accent, 200)))
                        g.DrawString("0" + (i + 1), sf, num, sx, sy);
                    float nw = g.MeasureString("0" + (i + 1), sf).Width;
                    using (SolidBrush st = new SolidBrush(Palette.Alpha(Palette.Dim, 220)))
                        g.DrawString(steps[i], sf, st, sx + nw + 6, sy);
                    sx += nw + 6 + g.MeasureString(steps[i], sf).Width + 18;
                    if (i < steps.Length - 1)
                    {
                        using (SolidBrush arrow = new SolidBrush(Palette.Alpha(Palette.Accent, 90)))
                            g.DrawString("→", sf, arrow, sx - 12, sy);
                    }
                }
            }
        }

        void DrawProgress(Graphics g)
        {
            int x = 30, w = Width - 60;
            using (SolidBrush track = new SolidBrush(Palette.Panel)) g.FillRectangle(track, x, 158, w, 6);
            int fill = stepTotal <= 0 ? 0 : (int)(w * (step / (double)stepTotal));
            if (fill < 4) fill = 4;
            using (SolidBrush bar = new SolidBrush(Palette.Accent)) g.FillRectangle(bar, x, 158, fill, 6);
            DrawSteps(g, x, 174);

            Rectangle box = new Rectangle(x, 206, w, Height - 206 - 100);
            using (SolidBrush bg = new SolidBrush(Color.FromArgb(150, 0, 0, 0))) g.FillRectangle(bg, box);
            using (Pen edge = new Pen(Color.FromArgb(70, Palette.Accent), 1)) g.DrawRectangle(edge, box);
            using (Font mono = new Font("Consolas", 9f, FontStyle.Regular, GraphicsUnit.Point))
            using (SolidBrush fb = new SolidBrush(Palette.Alpha(Palette.Text, 225)))
            {
                float lineH = mono.GetHeight(g) + 2;
                int maxLines = (int)((box.Height - 16) / lineH);
                int start = Math.Max(0, logLines.Count - maxLines);
                float ly = box.Y + 8;
                for (int i = start; i < logLines.Count; i++)
                {
                    g.DrawString(logLines[i], mono, fb, box.X + 12, ly);
                    ly += lineH;
                }
            }
        }

        static void DrawCheck(Graphics g, Rectangle r, bool on)
        {
            using (Pen edge = new Pen(on ? Palette.Accent : Palette.Alpha(Palette.Dim, 180), 1))
                g.DrawRectangle(edge, r);
            if (!on) return;
            using (SolidBrush fill = new SolidBrush(Palette.Alpha(Palette.Accent, 40))) g.FillRectangle(fill, r);
            using (Pen tick = new Pen(Palette.Accent, 2f))
            {
                g.DrawLine(tick, r.X + 4, r.Y + 10, r.X + 8, r.Y + 15);
                g.DrawLine(tick, r.X + 8, r.Y + 15, r.X + 16, r.Y + 5);
            }
        }

        void DrawDanger(Graphics g, Rectangle r, string text, bool enabled, bool hot)
        {
            Color red = Color.FromArgb(255, 97, 97);
            using (SolidBrush bg = new SolidBrush(hot && enabled ? Palette.Alpha(red, 56) : Palette.Alpha(red, 14)))
                g.FillRectangle(bg, r);
            using (Pen edge = new Pen(enabled ? red : Palette.Alpha(red, 70), 1)) g.DrawRectangle(edge, r);
            using (Font f = new Font("Microsoft YaHei UI", 11.5f, FontStyle.Bold, GraphicsUnit.Point))
            using (SolidBrush fg = new SolidBrush(enabled ? red : Palette.Alpha(red, 90)))
            using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
                g.DrawString(text, f, fg, r, sf);
        }

        void DrawButton(Graphics g, Rectangle r, string text, bool enabled, bool hot)
        {
            // 主按钮常态就是实色主题青 + 黑字，悬停翻成近白——和主题里「青底黑字」的按钮同一套语言。
            Color fill = !enabled ? Palette.Alpha(Palette.Dim, 20) : (hot ? Color.FromArgb(232, 248, 250) : Palette.Accent);
            Color ink = !enabled ? Palette.Alpha(Palette.Dim, 160) : Palette.Bg;
            if (enabled)
            {
                using (SolidBrush glow = new SolidBrush(Palette.Alpha(Palette.Accent, hot ? 46 : 22)))
                    g.FillRectangle(glow, new Rectangle(r.X - 3, r.Y - 3, r.Width + 6, r.Height + 6));
            }
            using (SolidBrush bg = new SolidBrush(fill)) g.FillRectangle(bg, r);
            using (Pen edge = new Pen(enabled ? Palette.Accent : Palette.Alpha(Palette.Dim, 90), 1))
                g.DrawRectangle(edge, r);
            using (Font f = new Font("Microsoft YaHei UI", 12.5f, FontStyle.Bold, GraphicsUnit.Point))
            using (SolidBrush fg = new SolidBrush(ink))
            using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
                g.DrawString(text, f, fg, r, sf);
        }

        static void DrawSpaced(Graphics g, string text, float x, float y, Font f, Color c, float spacing)
        {
            using (SolidBrush b = new SolidBrush(c))
            {
                float cx = x;
                foreach (char ch in text)
                {
                    g.DrawString(ch.ToString(), f, b, cx, y);
                    cx += g.MeasureString(ch.ToString(), f).Width + spacing;
                }
            }
        }

        // ---- 交互 -----------------------------------------------------------
        protected override void OnMouseMove(MouseEventArgs e)
        {
            if (dragging && e.Button == MouseButtons.Left)
            {
                Point p = Control.MousePosition;
                Location = new Point(p.X - dragOffset.X, p.Y - dragOffset.Y);
                return;
            }
            int prevRow = hoverRow;
            hoverRow = -1;
            for (int i = 0; i < rows.Count; i++) if (rows[i].Key.Contains(e.Location)) hoverRow = i;
            bool prevStart = hoverStart, prevClose = hoverClose;
            hoverStart = rStart.Contains(e.Location);
            hoverUninstall = rUninstall.Contains(e.Location);
            hoverClose = rClose.Contains(e.Location);
            Cursor = (hoverStart || hoverUninstall || hoverClose || hoverRow >= 0) ? Cursors.Hand : Cursors.Default;
            if (prevRow != hoverRow || prevStart != hoverStart || prevClose != hoverClose || hoverUninstall) Invalidate();
        }

        protected override void OnMouseDown(MouseEventArgs e)
        {
            if (e.Button != MouseButtons.Left) return;
            if (e.Y < 52)
            {
                dragging = true;
                dragOffset = new Point(Cursor.Position.X - Location.X, Cursor.Position.Y - Location.Y);
            }
        }

        protected override void OnMouseUp(MouseEventArgs e)
        {
            dragging = false;
            if (e.Button != MouseButtons.Left) return;
            if (rClose.Contains(e.Location)) { Close(); return; }

            if (busy) return;
            if (finished)
            {
                if (rStart.Contains(e.Location)) Close();
                return;
            }
            if (rBoot.Contains(e.Location)) { bootAfter = !bootAfter; Invalidate(); return; }

            for (int i = 0; i < rows.Count; i++)
            {
                if (!rows[i].Key.Contains(e.Location)) continue;
                PackInfo p = rows[i].Value;
                if (p.Required) return;
                if (selected.Contains(p.Id)) selected.Remove(p.Id); else selected.Add(p.Id);
                Invalidate();
                return;
            }
            if (rUninstall.Contains(e.Location) && !finishing) { StartUninstall(); return; }
            if (rStart.Contains(e.Location) && selected.Count > 0) StartInstall();
        }

        void StartUninstall()
        {
            if (busy || finishing) return;
            finishing = true; busy = true; finished = false; failed = false;
            logLines.Clear();
            status = "正在卸载…";
            step = 0; stepTotal = 4;
            Invalidate();
            List<string> ids = new List<string>();
            foreach (PackInfo pack in ui.Packs) ids.Add(pack.Id);
            System.Threading.ThreadPool.QueueUserWorkItem(delegate
            {
                try
                {
                    Installer.Extract(ExeDir, null);
                    bool ok = Installer.RunScript("uninstall.ps1", ids, delegate (string line) { Post(delegate { AddLog(line); }); }, null, dshHome);
                    Post(delegate
                    {
                        finishing = false; busy = false; finished = true; failed = !ok;
                        if (ok) installed = false;
                        status = ok ? "卸载完成" : "卸载失败";
                    });
                }
                catch (Exception ex)
                {
                    Post(delegate { AddLog("错误：" + ex.Message); finishing = false; busy = false; finished = true; failed = true; });
                }
            });
            pump.Start();
        }

        void StartInstall()
        {
            if (busy || finishing) return;
            busy = true; finished = false; failed = false;
            StartScanWave();
            logLines.Clear();
            status = "解包安装载荷…";
            step = 0; stepTotal = ui.Packs.Count + 4;
            Invalidate();
            List<string> ids = new List<string>(selected);
            System.Threading.ThreadPool.QueueUserWorkItem(delegate
            {
                try
                {
                    Installer.Extract(ExeDir, delegate (int percent, string text)
                    {
                        Post(delegate { step = Math.Max(1, percent * 2 / 100); status = text; });
                    });
                    Post(delegate { status = "运行安装引擎…"; step = 2; });
                    bool ok = Ui.Installer.Run(ui, ids, true, delegate (string line)
                    {
                        Post(delegate { AddLog(line); });
                    }, null, dshHome);
                    if (ok)
                    {
                        if (bootAfter) Installer.LaunchDsh();
                        Post(delegate { finished = true; failed = false; busy = false; step = stepTotal; installed = true; status = "完成"; });
                    }
                    else
                    {
                        Post(delegate { finished = true; failed = true; busy = false; status = "安装失败"; });
                    }
                }
                catch (Exception ex)
                {
                    Post(delegate { AddLog("错误：" + ex.Message); finished = true; failed = true; busy = false; status = "安装失败"; });
                }
            });
            pump.Start();
        }

        /* 跨线程不改控件：统一塞进队列，由 pump 定时器在 UI 线程上执行。 */
        readonly System.Collections.Concurrent.ConcurrentQueue<Action> pending = new System.Collections.Concurrent.ConcurrentQueue<Action>();
        void Post(Action action) { if (action != null) pending.Enqueue(action); }

        void AddLog(string line)
        {
            string t = line.TrimEnd();
            if (t.Length == 0) return;
            logLines.Add(t);
            if (t.StartsWith("[exv] ")) logLines[logLines.Count - 1] = t.Substring(6);
            string s = logLines[logLines.Count - 1];
            if (s.StartsWith("已复制")) step = Math.Max(step, 3);
            Invalidate();
        }

        protected override void OnShown(EventArgs e)
        {
            base.OnShown(e);
            if (autoStart && selected.Count > 0) StartInstall();
        }

        void Pump()
        {
            Action action;
            bool ran = false;
            while (pending.TryDequeue(out action))
            {
                try { action(); } catch { }
                ran = true;
            }
            if (ran || busy || finished) Invalidate();
            if (finished) pump.Stop();
        }
    }

    // ---- 安装引擎驱动 -------------------------------------------------------
    static class Installer
    {
        public static void Extract(string target, Action<int, string> progress)
        {
            if (Directory.Exists(target)) Directory.Delete(target, true);
            Directory.CreateDirectory(target);
            string zipPath = Path.Combine(target, "payload.zip");
            using (Stream src = Assembly.GetExecutingAssembly().GetManifestResourceStream("payload.zip"))
            {
                if (src == null) throw new InvalidOperationException("安装包内缺少 payload.zip");
                using (FileStream fs = File.Create(zipPath)) src.CopyTo(fs);
            }
            using (ZipArchive zip = ZipFile.OpenRead(zipPath))
            {
                int total = zip.Entries.Count;
                int n = 0;
                foreach (ZipArchiveEntry entry in zip.Entries)
                {
                    n++;
                    string dest = Path.Combine(target, entry.FullName.Replace('/', Path.DirectorySeparatorChar));
                    if (entry.FullName.EndsWith("/"))
                    {
                        Directory.CreateDirectory(dest);
                        continue;
                    }
                    Directory.CreateDirectory(Path.GetDirectoryName(dest));
                    entry.ExtractToFile(dest, true);
                    if (progress != null && n % 20 == 0) progress(n * 100 / total, "解包安装载荷… " + (n * 100 / total) + "%");
                }
            }
            File.Delete(zipPath);
            if (progress != null) progress(100, "载荷解包完成");
        }

        public static bool Run(Manifest ui, List<string> packs, bool noLaunch, Action<string> onLine, string logPath, string dshHome)
        {
            return RunScript("install.ps1", packs, onLine, logPath, dshHome);
        }

        public static bool RunScript(string scriptName, List<string> packs, Action<string> onLine, string logPath, string dshHome)
        {
            string dir = Path.Combine(Path.GetTempPath(), "dsh-exv-setup-" + Process.GetCurrentProcess().Id);
            string script = Path.Combine(dir, scriptName);
            /* 静默模式不会先走界面里那一步解包，这里兜底解一次。 */
            if (!File.Exists(script)) Extract(dir, null);
            string log = logPath ?? Path.Combine(dir, "install.log");
            StringBuilder args = new StringBuilder();
            args.Append("-NoProfile -ExecutionPolicy Bypass -File \"").Append(script).Append("\"");
            args.Append(" -NoLaunch");
            if (packs != null && packs.Count > 0) args.Append(" -Packs ").Append(string.Join(",", packs.ToArray()));
            args.Append(" -LogPath \"").Append(log).Append("\"");
            if (!string.IsNullOrEmpty(dshHome)) args.Append(" -DshHomeOverride \"").Append(dshHome).Append("\"");

            ProcessStartInfo psi = new ProcessStartInfo("powershell.exe", args.ToString());
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            psi.RedirectStandardOutput = true;
            psi.RedirectStandardError = true;
            psi.StandardOutputEncoding = Encoding.UTF8;
            psi.StandardErrorEncoding = Encoding.UTF8;

            TryTrace("run args=" + args.ToString());
            using (Process p = Process.Start(psi))
            {
                TryTrace("started pid=" + p.Id);
                /* 直接吃子进程的 stdout（脚本里已经把 Console 输出设成 UTF-8），
                   不再一边读文件一边并发读，避免日志重复。 */
                p.OutputDataReceived += delegate (object sender, DataReceivedEventArgs ev)
                {
                    if (ev.Data != null && onLine != null) onLine(ev.Data);
                };
                p.ErrorDataReceived += delegate (object sender, DataReceivedEventArgs ev)
                {
                    if (ev.Data != null && onLine != null) onLine(ev.Data);
                };
                p.BeginOutputReadLine();
                p.BeginErrorReadLine();
                /* PowerShell 偶尔把自己的 stdout 挂住不退出；引擎在跑完时会写 <日志>.done，
                   以标记为准，最多等 10 分钟。 */
                string donePath = log + ".done";
                for (int wait = 0; wait < 6000; wait += 1)
                {
                    if (File.Exists(donePath) || p.HasExited) break;
                    try
                    {
                        if (File.Exists(log))
                        {
                            string tail = File.ReadAllText(log);
                            bool finishedLine = tail.Contains("安装完成") || tail.Contains("卸载完成") || tail.Contains("安装失败") || tail.Contains("卸载失败");
                            if (finishedLine && (DateTime.Now - File.GetLastWriteTime(log)).TotalSeconds > 2.5) break;
                        }
                    }
                    catch { }
                    System.Threading.Thread.Sleep(100);
                }
                bool engineOk = p.HasExited ? p.ExitCode == 0 : true;
                try
                {
                    if (File.Exists(log))
                    {
                        string all = File.ReadAllText(log);
                        if (all.Contains("安装失败") || all.Contains("卸载失败")) engineOk = false;
                        else if (all.Contains("安装完成") || all.Contains("卸载完成")) engineOk = true;
                    }
                }
                catch { }
                try
                {
                    if (File.Exists(donePath)) engineOk = File.ReadAllText(donePath).Trim() == "ok";
                }
                catch { }
                try { if (!p.HasExited) p.Kill(); } catch { }
                p.WaitForExit();
            return p.ExitCode == 0;
            }
        }

        public static void TryTrace(string text)
        {
            try
            {
                File.AppendAllText(Path.Combine(Path.GetTempPath(), "dsh-exv-trace.txt"), DateTime.Now.ToString("HH:mm:ss") + " " + text + Environment.NewLine);
            }
            catch { }
        }

        static void Drain(string log, ref long pos, Action<string> onLine)
        {
            if (onLine == null || !File.Exists(log)) return;
            try
            {
                using (FileStream fs = new FileStream(log, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                {
                    if (pos > fs.Length) pos = 0;
                    fs.Seek(pos, SeekOrigin.Begin);
                    using (StreamReader r = new StreamReader(fs, Encoding.UTF8))
                    {
                        string line;
                        while ((line = r.ReadLine()) != null) onLine(line);
                    }
                    pos = fs.Position;
                }
            }
            catch { }
        }

        public static void LaunchDsh()
        {
            string exe = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                @"Programs\DeepSeek Harness\DeepSeek Harness.exe");
            if (File.Exists(exe)) Process.Start(exe);
        }
    }
}
