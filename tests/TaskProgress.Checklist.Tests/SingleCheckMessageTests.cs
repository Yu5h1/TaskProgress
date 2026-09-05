// Exercises set/reset through the production bridge and existing request command against temporary files.
using System.Text;
using System.Text.Json;
using TaskProgress;

internal static partial class Program
{
    private static void VerifySingleCheckMessages(string root)
    {
        var path = Path.Combine(root, "single-check.checklist");
        var original = SingleCheckFixture();
        File.WriteAllBytes(path, original);
        var store = new ChecklistDocumentStore();
        var initial = store.Load(path);
        var bridge = new ChecklistBridge(path);

        using (var response = SendCheckMessage(bridge, "set",
            new { workItemId = 1, checkIndex = 1, status = "failed", observed = "  按鈕沒有啟用。  " }))
        {
            Equal("result", response.RootElement.GetProperty("type").GetString(), "set result without revision");
            var saved = store.Load(path);
            Equal(ChecklistStatus.Failed, saved.Items[0].Status, "set derives failed parent");
            Equal("按鈕沒有啟用。", saved.Items[0].Checks[1].Observed, "set preserves Chinese evidence");
            Equal<string?>(null, saved.Items[0].Checks[1].Resolved, "set clears old resolved evidence");
            Equal(saved.Revision, response.RootElement.GetProperty("payload").GetProperty("revision").GetString(),
                "set returns persisted revision");
            Equal("failed", response.RootElement.GetProperty("payload").GetProperty("items")[0]
                .GetProperty("checks")[1].GetProperty("status").GetString(), "set snapshot status");
            Equal(initial.Items[0].Checks[0], saved.Items[0].Checks[0], "set preserves agent evidence");
            Equal(initial.Items[0].Checks[2], saved.Items[0].Checks[2], "set preserves other manual check");
        }
        using (var response = SendCheckMessage(bridge, "set", new { workItemId = 1, checkIndex = 1, status = "passed" }))
        {
            Equal("result", response.RootElement.GetProperty("type").GetString(), "set revises saved manual result");
            Equal(ChecklistStatus.Passed, store.Load(path).Items[0].Status, "set derives passed parent");
        }
        using (var response = SendCheckMessage(bridge, "set", new { workItemId = 1, checkIndex = 1, status = "pending" }))
        {
            Equal("result", response.RootElement.GetProperty("type").GetString(), "set accepts pending");
            Equal(ChecklistStatus.Pending, store.Load(path).Items[0].Status, "set derives pending parent");
        }

        object[] invalidSets =
        [
            new { workItemId = 1, checkIndex = 0, status = "pending" },
            new { workItemId = 2, checkIndex = 0, status = "passed" },
            new { workItemId = 1, checkIndex = 1, status = "failed" },
            new { workItemId = 1, checkIndex = 1, status = "failed", observed = " " },
            new { workItemId = 1, checkIndex = 1, status = "passed", observed = "unexpected" },
            new { workItemId = 99, checkIndex = 1, status = "passed" },
            new { workItemId = 1, checkIndex = 99, status = "passed" },
            new { workItemId = 0, checkIndex = 1, status = "passed" },
            new { workItemId = 1, checkIndex = -1, status = "passed" },
            new { workItemId = "1", checkIndex = 1, status = "passed" },
            new { workItemId = 1, checkIndex = false, status = "passed" },
            new { workItemId = 1, checkIndex = 0.5, status = "passed" },
            new { workItemId = 1, checkIndex = 1, status = "unknown" },
            new { workItemId = 1, checkIndex = 1, status = "passed", ifStatus = "pending" },
            new { workItemId = 1, checkIndex = 1, status = "passed", revision = initial.Revision },
            new { workItemId = 1, checkIndex = 1, status = "passed", resolved = "client evidence" },
            new { workItemId = 1, checkIndex = 1, status = "passed", path = path },
            new { workItemId = 1, checkIndex = 1, status = "failed", observed = new string('x', 4001) },
            new { workItemId = 1, checkIndex = 1, status = "failed", observed = 3 },
            new { },
        ];
        foreach (var payload in invalidSets) RejectCheckMessage(bridge, path, "set", payload);

        File.WriteAllBytes(path, original);
        using (var response = SendCheckMessage(bridge, "reset", new { targets = new[] { new { workItemId = 1, checkIndex = 1 } } }))
        {
            Equal("result", response.RootElement.GetProperty("type").GetString(), "targeted reset result");
            var saved = store.Load(path);
            Equal(ChecklistStatus.Pending, saved.Items[0].Status, "targeted reset derives parent");
            Equal(ChecklistStatus.Pending, saved.Items[0].Checks[1].Status, "targeted reset clears result");
            Equal<string?>(null, saved.Items[0].Checks[1].Observed, "targeted reset clears observed");
            Equal<string?>(null, saved.Items[0].Checks[1].Resolved, "targeted reset clears resolved");
            Equal(initial.Items[0].Checks[0], saved.Items[0].Checks[0], "targeted reset preserves resolved agent");
            Equal(initial.Items[0].Checks[2], saved.Items[0].Checks[2], "targeted reset preserves unselected manual");
            Equal(initial.Items[1].Checks[0], saved.Items[1].Checks[0], "targeted reset preserves failed agent");
            Equal(initial.Items[1].Checks[1], saved.Items[1].Checks[1], "targeted reset preserves other item");
        }

        File.WriteAllBytes(path, original);
        using (var response = SendCheckMessage(bridge, "reset", new { }))
        {
            Equal("result", response.RootElement.GetProperty("type").GetString(), "reset all result");
            var saved = store.Load(path);
            foreach (var check in saved.Items.SelectMany(item => item.Checks).Where(check => check.IsManual))
            {
                Equal(ChecklistStatus.Pending, check.Status, "reset all clears manual");
                Equal<string?>(null, check.Observed, "reset all clears observed");
                Equal<string?>(null, check.Resolved, "reset all clears resolved");
            }
            Equal(initial.Items[0].Checks[0], saved.Items[0].Checks[0], "reset all preserves resolved agent");
            Equal(initial.Items[1].Checks[0], saved.Items[1].Checks[0], "reset all preserves failed agent");
            Equal(ChecklistStatus.Pending, saved.Items[0].Status, "reset all derives pending parent");
            Equal(ChecklistStatus.Failed, saved.Items[1].Status, "agent failure still determines parent");
            Equal(saved.Revision, response.RootElement.GetProperty("payload").GetProperty("revision").GetString(),
                "reset returns persisted revision");
            True(saved.HasUtf8Bom && saved.NewLine == "\r\n", "writes preserve BOM and newline");
        }

        File.WriteAllBytes(path, original);
        using (var response = SendCheckMessage(bridge, "reset", new { targets = Array.Empty<object>() }))
        {
            Equal("result", response.RootElement.GetProperty("type").GetString(), "empty targets succeeds");
            SequenceEqual(original, File.ReadAllBytes(path), "empty targets does not mean reset all");
        }
        foreach (var invalidTarget in new object[]
        {
            new { workItemId = 1, checkIndex = 0 },
            new { workItemId = 2, checkIndex = 0 },
            new { workItemId = 99, checkIndex = 0 },
            new { workItemId = 1, checkIndex = 99 },
            new { workItemId = 1, checkIndex = 1 },
            new { workItemId = "1", checkIndex = 2 },
            new { workItemId = 1, checkIndex = -1 },
            new { workItemId = 1, checkIndex = 2, status = "pending" },
        })
        {
            RejectCheckMessage(bridge, path, "reset", new { targets = new object[] { new { workItemId = 1, checkIndex = 1 }, invalidTarget } });
        }
        RejectCheckMessage(bridge, path, "reset", new { targets = (object?)null });
        RejectCheckMessage(bridge, path, "reset", new { targets = "all" });
        RejectCheckMessage(bridge, path, "reset", new { targets = new object?[] { null } });
        RejectCheckMessage(bridge, path, "reset", new { path });
        foreach (var type in new[] { "set", "reset" })
        {
            RejectCheckMessage(bridge, path, type, null);
            RejectCheckMessage(bridge, path, type, Array.Empty<object>());
            var before = File.ReadAllBytes(path);
            using var response = JsonDocument.Parse(bridge.Handle(JsonSerializer.Serialize(new { version = 1, id = "missing-payload", type })));
            Equal("invalid_request", response.RootElement.GetProperty("error").GetProperty("code").GetString(), "missing payload rejected");
            SequenceEqual(before, File.ReadAllBytes(path), "missing payload preserves file");
        }

        VerifyCheckRequest(path, "set", new { workItemId = 1, checkIndex = 1, status = "failed", observed = "中文結果。" });
        Equal("中文結果。", store.Load(path).Items[0].Checks[1].Observed, "request set persists Chinese evidence");
        VerifyCheckRequest(path, "reset", new { });
        Equal(ChecklistStatus.Pending, store.Load(path).Items[0].Checks[1].Status, "request reset persists");
    }

    private static JsonDocument SendCheckMessage(ChecklistBridge bridge, string type, object? payload) =>
        JsonDocument.Parse(bridge.Handle(JsonSerializer.Serialize(new { version = 1, id = "single-check", type, payload })));

    private static void RejectCheckMessage(ChecklistBridge bridge, string path, string type, object? payload)
    {
        var before = File.ReadAllBytes(path);
        using var response = SendCheckMessage(bridge, type, payload);
        Equal("invalid_request", response.RootElement.GetProperty("error").GetProperty("code").GetString(), $"{type} rejects invalid payload");
        SequenceEqual(before, File.ReadAllBytes(path), $"{type} invalid payload preserves entire file");
    }

    private static void VerifyCheckRequest(string path, string type, object payload)
    {
        var previousIn = Console.In;
        var previousOut = Console.Out;
        var previousError = Console.Error;
        using var input = new StringReader(JsonSerializer.Serialize(new { version = 1, id = "request-write", type, payload }));
        using var output = new StringWriter();
        using var error = new StringWriter();
        int exitCode;
        try
        {
            Console.SetIn(input);
            Console.SetOut(output);
            Console.SetError(error);
            exitCode = ChecklistCommand.Request(["--file", path]);
        }
        finally
        {
            Console.SetIn(previousIn);
            Console.SetOut(previousOut);
            Console.SetError(previousError);
        }
        Equal(0, exitCode, $"request {type} exit code");
        Equal("", error.ToString(), $"request {type} stderr");
        using var response = JsonDocument.Parse(output.ToString());
        Equal("result", response.RootElement.GetProperty("type").GetString(), $"request {type} result");
        Equal("request-write", response.RootElement.GetProperty("id").GetString(), "request preserves correlation id");
    }

    private static byte[] SingleCheckFixture()
    {
        var text = """
            # Write messages Checklist

            Current round: `plan.md#round`.

            - [x] **1. Resolved work**
              Outcome: Results remain revisable only for manual checks.
              Checks:
                - [x] **Agent proof**
                  - Action: Execute proof.
                  - Expect: Proof passes.
                  - Observed: Old agent failure.
                  - Resolved: Agent verified the intervention.
                - [x] **Manual proof** `[manual]`
                  - Action: Inspect control.
                  - Expect: Control works.
                  - Reason: Needs interaction.
                  - Observed: Old manual failure.
                  - Resolved: User verified the intervention.
                - [x] **Other manual proof** `[manual]`
                  - Action: Inspect another control.
                  - Expect: Control works.
                  - Reason: Needs interaction.

            - [!] **2. Failed work**
              Outcome: Agent failures remain evidence after manual reset.
              Checks:
                - [!] **Agent failure**
                  - Action: Execute proof.
                  - Expect: Proof passes.
                  - Observed: Agent proof failed.
                - [!] **Manual failure** `[manual]`
                  - Action: Inspect control.
                  - Expect: Control works.
                  - Reason: Needs interaction.
                  - Observed: Manual proof failed.
            """;
        return [.. Encoding.UTF8.Preamble, .. Encoding.UTF8.GetBytes(text.ReplaceLineEndings("\r\n") + "\r\n")];
    }
}
