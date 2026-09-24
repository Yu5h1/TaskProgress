// Exposes exact-file decision operations without starting the report server.
using System.Text.Json.Nodes;

namespace TaskProgress;

internal static class DecisionCommand
{
    public static int Run(string[] args)
    {
        if ((args.Length == 3 || args.Length == 5 && args[3] == "--task") && args[0] == "request" && args[1] == "--file")
        {
            var response = new DecisionStore(args[2]).Handle(Console.In.ReadToEnd(), args.Length == 5 ? args[4] : null);
            Console.WriteLine(response.ToJsonString());
            return 0;
        }
        if (args.Length == 2 && args[0] == "validate")
        {
            var response = new DecisionStore(args[1]).Handle("{\"operation\":\"load\"}");
            Console.WriteLine(response.ToJsonString());
            return response["ok"]?.GetValue<bool>() == true ? 0 : 1;
        }
        if (args.Length == 1 && args[0] == "install") { DecisionFileRegistration.Install(); return 0; }
        if (args.Length == 1 && args[0] == "uninstall") { DecisionFileRegistration.Uninstall(); return 0; }
        if (args.Length == 1)
        {
            var store = new DecisionStore(args[0]);
            var response = store.Handle("{\"operation\":\"load\"}");
            if (response["ok"]?.GetValue<bool>() != true) throw new CliException(response["error"]?.ToJsonString() ?? "Invalid decision file.");
            ChecklistDesktopHost.RunDocument(args[0], "decisions-ui", "taskprogress.decisions", "Decisions", json => store.Handle(json).ToJsonString());
            return 0;
        }
        throw new CliException("用法：task-progress decisions <file.decisions> | validate <file> | request --file <file> | install | uninstall");
    }
}
