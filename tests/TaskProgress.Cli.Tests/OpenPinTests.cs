using TaskProgress;

internal static class OpenPinTests
{
    public static void Run()
    {
        var store = new ScopeStore(Path.Combine(Path.GetTempPath(), $"pin-unused-{Guid.NewGuid():N}.json"));
        var request = TaskProgress.Program.ParseOpenRequest([".", "--pin", "card & one", "--no-browser"], store);
        if (request.Pin != "card & one" || request.OpenBrowser) throw new Exception("Pin options lost");
        foreach (var args in new[] {
            new[] { ".", "--pin" }, new[] { ".", "--pin", " " },
            new[] { ".", "--pin", "a", "--pin", "b" } })
        {
            try { TaskProgress.Program.ParseOpenRequest(args, store); }
            catch (CliException) { continue; }
            throw new Exception("Invalid pin options accepted");
        }
        var uri = LocalWebServiceClient.BuildViewerUri(new Uri("http://127.0.0.1:8001/"), "web", "card & one");
        if (uri.Query != "?scope=web&pin=card%20%26%20one") throw new Exception("Pin URI not encoded");
        var report = ReportFolder.Load(Directory.GetCurrentDirectory());
        report.ValidatePin(null);
        using var json = System.Text.Json.JsonDocument.Parse(File.ReadAllBytes(report.ReportPath));
        report.ValidatePin(json.RootElement.GetProperty("tasks")[0].GetProperty("id").GetString());
        try { report.ValidatePin("missing-pin-" + Guid.NewGuid().ToString("N")); }
        catch (CliException) { Console.WriteLine("Open pin checks passed; no service launched."); return; }
        throw new Exception("Missing pin accepted");
    }
}
