# Claude Code Context Bar

English | [中文](README_CN.md)

Claude Code Context Bar adds a compact, always-visible context usage bar to the Claude Code extension for VS Code and Cursor.

It updates the installed Claude Code extension webview so the context usage entry in the input footer shows:

- A colorful context usage bar
- The current used-context percentage
- A hover popover with model, token totals, category usage, memory files, and custom agent details
- The original official `/compact` behavior when the bar is clicked

## Features

- Automatically finds the latest installed Claude Code extension
  - Cursor: `~/.cursor/extensions`
  - VS Code: `~/.vscode/extensions`
  - VS Code Insiders: `~/.vscode-insiders/extensions`
- Updates `webview/index.js` and `webview/index.css` inside the extension
- Backs up the original extension files to `backups/` the first time each extension version is handled
- Shows colorful segments by context category when detailed usage data is available
- Falls back to a simple percentage bar when category details are unavailable
- Reuses the official context usage data for the hover popover
- Refreshes usage data every 15 seconds
- Supports a manually specified extension directory
- Works with macOS / Linux shell and Windows PowerShell

## Files

- `apply-context-bar.js`: main script that finds the extension, creates backups, and writes the UI changes
- `install-claude-context-bar.sh`: macOS / Linux installer
- `install-claude-context-bar.ps1`: Windows PowerShell installer
- `backups/`: original extension files saved automatically

## Requirements

You need `node` available in your terminal.

Check it with:

```bash
node --version
```

If this command is not found, install Node.js first.

## Install on macOS / Linux

Run this from the project directory:

```bash
./install-claude-context-bar.sh
```

If the scripts are not executable, run:

```bash
chmod +x install-claude-context-bar.sh apply-context-bar.js
```

Then run the installer again.

## Install on Windows

Open PowerShell in the project directory and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\install-claude-context-bar.ps1
```

Or, if your PowerShell policy allows it:

```powershell
.\install-claude-context-bar.ps1
```

## Use a specific extension directory

By default, the script finds the latest Claude Code extension automatically. To select a specific extension directory, pass it as an argument.

macOS / Linux:

```bash
./install-claude-context-bar.sh "/path/to/anthropic.claude-code-x.y.z-*"
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\install-claude-context-bar.ps1 "C:\Users\you\.cursor\extensions\anthropic.claude-code-x.y.z-win32-x64"
```

You can also run the main script directly:

```bash
node apply-context-bar.js "/path/to/anthropic.claude-code-x.y.z-*"
```

## Reload the editor

After the script finishes successfully, reload the Claude Code extension UI:

1. Run `Developer: Reload Window` from the Cursor / VS Code command palette
2. Or restart Cursor / VS Code

## After Claude Code extension updates

When the Claude Code extension updates, the extension directory usually changes to a new version and the UI changes may be overwritten.

Run the installer again to apply the context bar to the latest extension version.

## License

Released under the [MIT License](LICENSE).
