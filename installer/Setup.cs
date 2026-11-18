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
        bool silent = false, noBoot = false;
        string packArg = null;
        string selftest = null;
        foreach (string a in rawArgs)
        {
            if (a.Equals("/S", StringComparison.OrdinalIgnoreCase)) silent = true;
            else if (a.Equals("/NOBOOT", StringComparison.OrdinalIgnoreCase)) noBoot = true;
            else if (a.StartsWith("/PACKS=", StringComparison.OrdinalIgnoreCase)) packArg = a.Substring(7);
            else if (a.StartsWith("/SELFTEST=", StringComparison.OrdinalIgnoreCase)) selftest = a.Substring(10);
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
        if (silent)
        {
            bool ok = Ui.Installer.Run(ui, ui.DefaultPackIds(), true, null, null);
            if (ok && !noBoot) Ui.Installer.LaunchDsh();
            return;
        }
        Application.Run(new Ui.SetupForm(ui, packArg));
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
        readonly List<string> selected = new List<string>();
        bool bootAfter = false;      // 默认不勾：和主流安装器一致
        bool busy, finished, failed;
        string status = "准备就绪";
        int step, stepTotal;
        readonly List<string> logLines = new List<string>();
        readonly System.Windows.Forms.Timer pump = new System.Windows.Forms.Timer();
        Rectangle rStart, rClose, rBoot;
        readonly List<KeyValuePair<Rectangle, PackInfo>> rows = new List<KeyValuePair<Rectangle, PackInfo>>();
        int hoverRow = -1;
        bool hoverStart, hoverClose;
        Point dragOffset;
        bool dragging;
        Process running;

        public SetupForm(Manifest m, string presetPacks)
        {
            ui = m;
            foreach (PackInfo p in ui.Packs) if (p.Required || p.Default) selected.Add(p.Id);
            if (!string.IsNullOrEmpty(presetPacks))
            {
                selected.Clear();
                foreach (string id in presetPacks.Split(',')) if (id.Trim().Length > 0) selected.Add(id.Trim());
                foreach (PackInfo p in ui.Packs) if (p.Required && !selected.Contains(p.Id)) selected.Add(p.Id);
            }
            FormBorderStyle = FormBorderStyle.None;
            StartPosition = FormStartPosition.CenterScreen;
            ClientSize = new Size(880, 640);
            DoubleBuffered = true;
            BackColor = Palette.Bg;
            Text = ui.Product + " " + ui.Version + " 安装器";
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);
            pump.Interval = 260;
            pump.Tick += delegate { Pump(); };
        }

        Font F(float size, bool bold, bool mono)
        {
            string family = mono ? "Consolas" : "Microsoft YaHei UI";
            float h = mono ? size * 0.95f : size;
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
            using (Font title = new Font("Microsoft YaHei UI", 20f, FontStyle.Bold, GraphicsUnit.Point))
            using (SolidBrush white = new SolidBrush(Palette.Text))
                g.DrawString(finished ? (failed ? "安装失败" : "安装完成") : (busy ? "正在安装" : "安装 " + ui.Product), title, white, 28, 58);

            using (Font sub = F(9.5f, false, false))
            using (SolidBrush dim = new SolidBrush(Palette.Dim))
                g.DrawString(busy ? status : "离线一键安装 · 勾选要装的增强包 · 不写入 Windows 卸载项", sub, dim, 30, 104);

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
            rStart = new Rectangle(Width - 210, by + 2, 180, 44);
            DrawButton(g, rStart, finished ? (failed ? "关闭" : "完成") : (busy ? "安装中…" : "开始安装"),
                !busy && (finished || selected.Count > 0), hoverStart);

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
                Rectangle row = new Rectangle(30, y, Width - 60, 62);
                rows.Add(new KeyValuePair<Rectangle, PackInfo>(row, p));
                bool on = selected.Contains(p.Id);
                bool hot = hoverRow == rows.Count - 1;
                using (SolidBrush bg = new SolidBrush(hot ? Palette.Alpha(Palette.Accent, 14) : Palette.Panel))
                    g.FillRectangle(bg, row);
                using (Pen edge = new Pen(on ? Color.FromArgb(90, Palette.Accent) : Palette.Alpha(Color.White, 18), 1))
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
                y += 70;
            }

            using (Font f = F(8.6f, false, false))
            using (SolidBrush b = new SolidBrush(Palette.Alpha(Palette.Dim, 200)))
                g.DrawString("本体三个包为必装项；增强包可自由勾选，之后重跑安装器即可增减。已验证的 DSH 版本：" + ui.Dsh, f, b,
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
            using (Font f = F(9.5f, false, false))
            using (SolidBrush b = new SolidBrush(Palette.Accent))
                g.DrawString(stepTotal > 0 ? ("第 " + Math.Min(step, stepTotal) + " / " + stepTotal + " 步") : "", f, b, x, 170);

            Rectangle box = new Rectangle(x, 200, w, Height - 200 - 100);
            using (SolidBrush bg = new SolidBrush(Color.FromArgb(2, 0, 0, 0))) g.FillRectangle(bg, box);
            using (Pen edge = new Pen(Palette.Line, 1)) g.DrawRectangle(edge, box);
            using (Font mono = new Font("Consolas", 9f, FontStyle.Regular, GraphicsUnit.Point))
            using (SolidBrush fb = new SolidBrush(Palette.Alpha(Palette.Text, 225)))
            {
                float lineH = mono.GetHeight(g) + 1;
                int maxLines = (int)((box.Height - 16) / lineH);
                int start = Math.Max(0, logLines.Count - maxLines);
                float ly = box.Y + 8;
                for (int i = start; i < logLines.Count; i++)
                {
                    g.DrawString(logLines[i], mono, fb, box.X + 10, ly);
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
            using (Font f = new Font("Microsoft YaHei UI", 11f, FontStyle.Bold, GraphicsUnit.Point))
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
            hoverClose = rClose.Contains(e.Location);
            Cursor = (hoverStart || hoverClose || hoverRow >= 0) ? Cursors.Hand : Cursors.Default;
            if (prevRow != hoverRow || prevStart != hoverStart || prevClose != hoverClose) Invalidate();
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
            if (rStart.Contains(e.Location) && selected.Count > 0) StartInstall();
        }

        void StartInstall()
        {
            busy = true; finished = false; failed = false;
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
                    }, null);
                    if (ok)
                    {
                        if (bootAfter) Installer.LaunchDsh();
                        Post(delegate { finished = true; failed = false; busy = false; step = stepTotal; status = "完成"; });
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

        void Post(Action action) { BeginInvoke(action); }

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

        void Pump() { if (finished) pump.Stop(); }
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

        public static bool Run(Manifest ui, List<string> packs, bool noLaunch, Action<string> onLine, string logPath)
        {
            string dir = Path.Combine(Path.GetTempPath(), "dsh-exv-setup-" + Process.GetCurrentProcess().Id);
            string script = Path.Combine(dir, "install.ps1");
            string log = logPath ?? Path.Combine(dir, "install.log");
            StringBuilder args = new StringBuilder();
            args.Append("-NoProfile -ExecutionPolicy Bypass -File \"").Append(script).Append("\"");
            args.Append(" -NoLaunch");
            if (packs != null && packs.Count > 0) args.Append(" -Packs ").Append(string.Join(",", packs.ToArray()));
            args.Append(" -LogPath \"").Append(log).Append("\"");

            ProcessStartInfo psi = new ProcessStartInfo("powershell.exe", args.ToString());
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            psi.RedirectStandardOutput = true;
            psi.RedirectStandardError = true;
            psi.StandardOutputEncoding = Encoding.UTF8;
            psi.StandardErrorEncoding = Encoding.UTF8;

            long readPos = 0;
            using (Process p = Process.Start(psi))
            {
                // 排空 stdout/stderr（不读会堵住子进程的管道），真正显示的文字走 UTF-8 日志文件。
                p.OutputDataReceived += delegate { };
                p.ErrorDataReceived += delegate { };
                p.BeginOutputReadLine();
                p.BeginErrorReadLine();
                System.Threading.Thread t = new System.Threading.Thread(delegate ()
                {
                    while (!p.HasExited)
                    {
                        Drain(log, ref readPos, onLine);
                        System.Threading.Thread.Sleep(180);
                    }
                });
                t.IsBackground = true;
                t.Start();
                p.WaitForExit();
                t.Join(1500);
                Drain(log, ref readPos, onLine);
                return p.ExitCode == 0;
            }
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
