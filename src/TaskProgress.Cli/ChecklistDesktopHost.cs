// Hosts the local Checklist surface in one STA WPF window backed by Microsoft Edge WebView2.
using System.Runtime.ExceptionServices;
using System.Windows;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;

namespace TaskProgress;

internal static class ChecklistDesktopHost
{
    private const string RuntimeDownloadUrl =
        "https://developer.microsoft.com/microsoft-edge/webview2/consumer/";

    public static void Run(string checklistPath)
    {
        var bridge = new ChecklistBridge(checklistPath);
        RunDocument(checklistPath, "checklist-ui", "taskprogress.checklist", "Checklist", bridge.Handle);
    }

    public static void RunDocument(string file, string assets, string host, string title, Func<string, string> handle)
    {
        Exception? failure = null;
        var thread = new Thread(() =>
        {
            try
            {
                RunWindow(file, assets, host, title, handle);
            }
            catch (Exception error)
            {
                failure = error;
            }
        });
        thread.SetApartmentState(ApartmentState.STA);
        thread.Start();
        thread.Join();

        if (failure is null) return;
        if (failure is WebView2RuntimeNotFoundException)
        {
            throw CreateRuntimeMissingError(failure.Message);
        }
        ExceptionDispatchInfo.Capture(failure).Throw();
    }

    /// <summary>
    /// Stable per-user WebView profile directory. The Checklist UI keeps its
    /// persistence-mode preference in this profile's own storage, so the folder
    /// must not depend on the current directory or on where the executable was
    /// published, or reopening the App would reset the preference.
    /// </summary>
    internal static string ResolveUserProfileDirectory()
    {
        var localAppData = Environment.GetFolderPath(
            Environment.SpecialFolder.LocalApplicationData,
            Environment.SpecialFolderOption.DoNotVerify);
        var root = string.IsNullOrWhiteSpace(localAppData) ? Path.GetTempPath() : localAppData;
        return Path.Combine(root, "TaskProgress", "checklist-webview");
    }

    internal static CliException CreateRuntimeMissingError(string detail) =>
        new(
            "找不到 Microsoft Edge WebView2 Runtime。"
            + $"請先安裝 Evergreen Runtime：{RuntimeDownloadUrl} "
            + $"({detail})");

    private static void RunWindow(string checklistPath, string assets, string host, string title, Func<string, string> handle)
    {
        var assetDirectory = Path.Combine(AppContext.BaseDirectory, assets);
        var entryPath = Path.Combine(assetDirectory, "index.html");
        if (!File.Exists(entryPath))
        {
            throw new CliException($"找不到 Checklist UI 資產：{entryPath}");
        }
        var application = new Application
        {
            ShutdownMode = ShutdownMode.OnMainWindowClose,
        };
        var webView = new WebView2();
        var window = new Window
        {
            Title = $"TaskProgress {title} — {Path.GetFileName(checklistPath)}",
            Width = 1100,
            Height = 760,
            MinWidth = 720,
            MinHeight = 480,
            WindowStartupLocation = WindowStartupLocation.CenterScreen,
            Content = webView,
        };
        Exception? initializationFailure = null;
        window.Loaded += async (_, _) =>
        {
            try
            {
                var profileDirectory = ResolveUserProfileDirectory();
                Directory.CreateDirectory(profileDirectory);
                var webViewEnvironment = await CoreWebView2Environment.CreateAsync(
                    browserExecutableFolder: null,
                    userDataFolder: profileDirectory);
                await webView.EnsureCoreWebView2Async(webViewEnvironment);
                webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
                webView.CoreWebView2.Settings.AreHostObjectsAllowed = false;
                webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                    host,
                    assetDirectory,
                    CoreWebView2HostResourceAccessKind.DenyCors);
                webView.CoreWebView2.WebMessageReceived += (_, message) =>
                {
                    var response = handle(message.WebMessageAsJson);
                    webView.CoreWebView2.PostWebMessageAsJson(response);
                };
                webView.CoreWebView2.NavigationStarting += (_, e) =>
                {
                    if (!Uri.TryCreate(e.Uri, UriKind.Absolute, out var uri) || uri.Host != host || uri.Scheme != "https") e.Cancel = true;
                };
                webView.CoreWebView2.NewWindowRequested += (_, e) => e.Handled = true;
                webView.CoreWebView2.Navigate($"https://{host}/index.html");
            }
            catch (Exception error)
            {
                initializationFailure = error;
                window.Close();
            }
        };
        application.Run(window);
        if (initializationFailure is not null)
        {
            ExceptionDispatchInfo.Capture(initializationFailure).Throw();
        }
    }

}
