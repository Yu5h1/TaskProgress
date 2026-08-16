// Reports a Checklist failure where the reader can actually see it.
using System.Windows;

namespace TaskProgress;

internal static class ChecklistErrorDialog
{
    /*
     * `checklist` is a window command, and it is normally launched from a
     * shortcut with no console attached. A message written to stderr in that
     * situation is invisible: the process exits and the reader sees an App that
     * flashed and vanished, with nothing to act on.
     *
     * The document is parsed before the window opens — a malformed file cannot
     * be shown — so this dialog is the only place a format error can surface.
     * It carries the parser's own message, which names the line and the rule.
     */
    public static void Show(string message)
    {
        var thread = new Thread(() => MessageBox.Show(
            message,
            "TaskProgress Checklist",
            MessageBoxButton.OK,
            MessageBoxImage.Error));
        thread.SetApartmentState(ApartmentState.STA);
        thread.Start();
        thread.Join();
    }
}
