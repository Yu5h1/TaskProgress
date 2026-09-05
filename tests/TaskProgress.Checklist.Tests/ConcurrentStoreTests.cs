// Verifies cooperating processes cannot both commit from the same Checklist revision.
using System.Diagnostics;
using System.Reflection;
using System.Text;
using TaskProgress;

internal static partial class Program
{
    private static void VerifyConcurrentStoreWriters(string root)
    {
        var path = Path.Combine(root, "concurrent-store.checklist");
        File.WriteAllBytes(path, SingleCheckFixture());
        using var gate = ChecklistDocumentStore.OpenWriteMutex(path);
        True(gate.WaitOne(TimeSpan.FromSeconds(5)), "parent acquires file write gate");
        var children = new List<Process>();
        try
        {
            try
            {
                children.Add(StartStoreWriter(path, Path.Combine(root, "writer-one"), "first writer"));
                children.Add(StartStoreWriter(path.ToUpperInvariant(), Path.Combine(root, "writer-two"), "second writer"));
                var timer = Stopwatch.StartNew();
                while ((!File.Exists(Path.Combine(root, "writer-one")) || !File.Exists(Path.Combine(root, "writer-two")))
                    && timer.Elapsed < TimeSpan.FromSeconds(5)) Thread.Sleep(20);
                True(File.Exists(Path.Combine(root, "writer-one")) && File.Exists(Path.Combine(root, "writer-two")),
                    "both writers loaded the initial revision");
                True(!children[0].HasExited && !children[1].HasExited, "writers wait while another process owns the gate");
            }
            finally
            {
                gate.ReleaseMutex();
            }
            foreach (var child in children) True(child.WaitForExit(10000), "store writer exits within deadline");
            var exitCodes = children.Select(child => child.ExitCode).Order().ToArray();
            True(exitCodes.SequenceEqual(new[] { 0, 3 }), "one writer commits and one reports revision conflict");
            var saved = new ChecklistDocumentStore().Load(path);
            Equal(ChecklistStatus.Failed, saved.Items[0].Checks[1].Status, "concurrent winner persisted");
            True(saved.Items[0].Checks[1].Observed is "first writer" or "second writer", "winner evidence is complete");
            Equal("Agent verified the intervention.", saved.Items[0].Checks[0].Resolved, "concurrent writers preserve agent proof");
        }
        finally
        {
            foreach (var child in children)
            {
                try
                {
                    if (!child.HasExited && !child.WaitForExit(1000))
                    {
                        child.Kill();
                        child.WaitForExit(5000);
                    }
                }
                finally
                {
                    child.Dispose();
                }
            }
        }
    }

    private static Process StartStoreWriter(string path, string readyPath, string observed)
    {
        var executable = Environment.ProcessPath ?? throw new InvalidOperationException("Missing test process path.");
        var start = new ProcessStartInfo(executable) { UseShellExecute = false };
        if (string.Equals(Path.GetFileNameWithoutExtension(executable), "dotnet", StringComparison.OrdinalIgnoreCase))
        {
            start.ArgumentList.Add(Assembly.GetExecutingAssembly().Location);
        }
        foreach (var argument in new[] { "--store-writer", path, readyPath, observed }) start.ArgumentList.Add(argument);
        return Process.Start(start) ?? throw new InvalidOperationException("Could not start store writer.");
    }

    private static int RunStoreWriter(string[] args)
    {
        try
        {
            var store = new ChecklistDocumentStore();
            var source = store.Load(args[1]);
            var updated = source.ApplyManualResults([new ChecklistManualResult(1, 1, ChecklistStatus.Failed, args[3])]);
            File.WriteAllText(args[2], "ready", Encoding.UTF8);
            store.Save(args[1], source.Revision, updated);
            return 0;
        }
        catch (CliException error) when (error.Message.Contains("外部修改", StringComparison.Ordinal))
        {
            return 3;
        }
        catch (Exception error)
        {
            Console.Error.WriteLine(error);
            return 1;
        }
    }
}
