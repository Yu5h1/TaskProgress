param(
    [Parameter(Mandatory)]
    [ValidateSet('probe', 'set', 'reset')]
    [string]$Mode
)

$ErrorActionPreference = 'Stop'
$taskHome = if ($env:TASK_PROGRESS_HOME) { $env:TASK_PROGRESS_HOME } else { Join-Path $env:LOCALAPPDATA 'TaskProgress' }
$endpointPath = Join-Path $taskHome 'endpoints/8001.json'
if (-not (Test-Path -LiteralPath $endpointPath -PathType Leaf)) {
    throw '找不到 8001 的端點檔；TaskProgress 服務可能未啟動。'
}
$endpoint = Get-Content -LiteralPath $endpointPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($endpoint.port -ne 8001 -or $endpoint.base_url -ne 'http://127.0.0.1:8001' -or [string]::IsNullOrWhiteSpace($endpoint.client_token)) {
    throw '8001 端點內容無效。'
}
$health = Invoke-RestMethod -Uri "$($endpoint.base_url)/__taskprogress/v1/health" -TimeoutSec 3
if ($health.service -ne 'taskprogress-edit-host') { throw '8001 的服務不是 TaskProgress。' }
if ($Mode -eq 'probe') { Write-Output 'TaskProgress 端點可用。'; return }

$payload = if ($Mode -eq 'set') {
    @{ workItemId = 2; checkIndex = 0; status = 'passed' }
} else {
    @{ targets = @(@{ workItemId = 2; checkIndex = 0 }) }
}
$body = @{ version = 1; id = 'third-party-roundtrip'; type = $Mode; payload = $payload } | ConvertTo-Json -Depth 5 -Compress
$headers = @{ Authorization = "Bearer $($endpoint.client_token)" }
$response = Invoke-RestMethod -Method Post -Uri "$($endpoint.base_url)/__taskprogress/v1/checklists/task-progress/third-party-write-sandbox" -Headers $headers -ContentType 'application/json' -Body $body -TimeoutSec 30
if ($response.type -ne 'result') { throw "Checklist 未接受請求：$($response.error.message)" }
Write-Output "Checklist $Mode 成功。"
