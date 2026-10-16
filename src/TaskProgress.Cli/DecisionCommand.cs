// Exposes exact-file decision operations without starting the report server.
using System.Text.Json.Nodes;

namespace TaskProgress;

internal static class DecisionCommand
{
    public static int Run(
        string[] args,
        Action<Uri>? openBrowser = null,
        Action<string>? openDesktop = null,
        Action<string>? reportError = null,
        TimeSpan? probeTimeout = null)
    {
        ArgumentNullException.ThrowIfNull(args);
        if ((args.Length == 3 || args.Length == 5 && args[3] == "--task") && args[0] == "request" && args[1] == "--file")
        {
            var response = new DecisionStore(args[2]).Handle(Console.In.ReadToEnd(), args.Length == 5 ? args[4] : null);
            Console.WriteLine(response.ToJsonString());
            return 0;
        }
        if (args.Length == 2 && args[0] == "validate")
        {
            var response = new DecisionStore(args[1]).Handle("{\"operation\":\"load\"}");
            if (response["sources"] is JsonObject sources)
                foreach (var source in sources)
                    if (source.Value?["status"]?.GetValue<string>() == "invalid")
                        Console.Error.WriteLine($"警告 [{source.Key}] {source.Value["message"]!.GetValue<string>()} ({source.Value["reference"]!.GetValue<string>()})");
            Console.WriteLine(response.ToJsonString());
            return response["ok"]?.GetValue<bool>() == true ? 0 : 1;
        }
        if (args.Length == 1 && args[0] == "install") { DecisionFileRegistration.Install(); return 0; }
        if (args.Length == 1 && args[0] == "uninstall") { DecisionFileRegistration.Uninstall(); return 0; }
        return DocumentOpenRouter.Run(
            args,
            DocumentKind.Decisions,
            openBrowser,
            openDesktop is null ? null : (_, path) => openDesktop(path),
            reportError,
            probeTimeout);
    }
}
