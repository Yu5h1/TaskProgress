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
        Exception? failure = null;
        var thread = new Thread(() =>
        {
            try
            {
                RunWindow(checklistPath);
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

    internal static CliException CreateRuntimeMissingError(string detail) =>
        new(
            "找不到 Microsoft Edge WebView2 Runtime。"
            + $"請先安裝 Evergreen Runtime：{RuntimeDownloadUrl} "
            + $"({detail})");

    private static void RunWindow(string checklistPath)
    {
        var assetDirectory = Path.Combine(AppContext.BaseDirectory, "checklist-ui");
        var entryPath = Path.Combine(assetDirectory, "index.html");
        if (!File.Exists(entryPath))
        {
            throw new CliException($"找不到 Checklist UI 資產：{entryPath}");
        }
        var bridge = new ChecklistBridge(checklistPath);
        var application = new Application
        {
            ShutdownMode = ShutdownMode.OnMainWindowClose,
        };
        var webView = new WebView2();
        var window = new Window
        {
            Title = $"TaskProgress Checklist — {Path.GetFileName(checklistPath)}",
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
                await webView.EnsureCoreWebView2Async();
                webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
                webView.CoreWebView2.Settings.AreHostObjectsAllowed = false;
                webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                    "taskprogress.checklist",
                    assetDirectory,
                    CoreWebView2HostResourceAccessKind.DenyCors);
                webView.CoreWebView2.WebMessageReceived += (_, message) =>
                {
                    var response = bridge.Handle(message.WebMessageAsJson);
                    webView.CoreWebView2.PostWebMessageAsJson(response);
                };
                webView.CoreWebView2.Navigate("https://taskprogress.checklist/index.html");
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
