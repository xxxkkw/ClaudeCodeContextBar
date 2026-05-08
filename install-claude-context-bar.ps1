$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ScriptJs = Join-Path $ScriptDir "apply-context-bar.js"

Write-Host "========================================"
Write-Host " Claude Code Context Bar"
Write-Host "========================================"
Write-Host ""

$Node = Get-Command node -ErrorAction SilentlyContinue
if (-not $Node) {
    Write-Host "Error: node was not found in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js first, then run this script again."
    exit 1
}

if (-not (Test-Path $ScriptJs)) {
    Write-Host "Error: installer script not found: $ScriptJs" -ForegroundColor Red
    exit 1
}

Write-Host "Applying changes..."
& node $ScriptJs @args
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "Reload Cursor / VS Code to see the context usage bar:"
Write-Host "- Command Palette: Developer: Reload Window"
Write-Host "- or restart Cursor / VS Code"
Write-Host ""
