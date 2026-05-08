# Claude Code Context Bar

[English](README.md) | 中文

给 Claude Code 的 VS Code / Cursor 扩展添加一个更直观的上下文使用量进度条。

脚本会修改本机已安装的 Claude Code 扩展 webview 文件，让输入框底部原本的上下文使用入口显示为：

- 彩色上下文进度条
- 已使用上下文百分比
- 悬浮弹窗中显示模型、token 总量、分类占用、Memory 文件和自定义 Agent 明细
- 点击进度条后继续使用官方原本的 `/compact` 行为

## 功能

- 自动查找本机最新版本的 Claude Code 扩展
  - Cursor: `~/.cursor/extensions`
  - VS Code: `~/.vscode/extensions`
  - VS Code Insiders: `~/.vscode-insiders/extensions`
- 修改扩展内的 `webview/index.js` 和 `webview/index.css`
- 首次处理某个扩展版本时，自动备份原始文件到 `backups/`
- 支持按上下文分类显示彩色分段；如果扩展未返回详细分类，则回退为普通百分比进度条
- 悬浮弹窗复用官方上下文用量数据，展示分类表、Memory 文件和自定义 Agent 明细
- 每 15 秒刷新一次上下文用量数据
- 可手动指定要处理的扩展目录
- 支持 macOS / Linux shell 和 Windows PowerShell

## 文件说明

- `apply-context-bar.js`：主脚本，负责查找扩展、备份文件并写入 UI 改动
- `install-claude-context-bar.sh`：macOS / Linux 安装脚本
- `install-claude-context-bar.ps1`：Windows PowerShell 安装脚本
- `backups/`：自动保存的扩展原始文件备份

## 使用前准备

需要本机能运行 `node` 命令。

如果脚本提示找不到 `node`，先安装 Node.js，并确认终端里可以执行：

```bash
node --version
```

## macOS / Linux 安装

在本目录运行：

```bash
./install-claude-context-bar.sh
```

如果没有执行权限，先运行：

```bash
chmod +x install-claude-context-bar.sh apply-context-bar.js
```

然后重新执行安装脚本。

## Windows 安装

在 PowerShell 里进入本目录后运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\install-claude-context-bar.ps1
```

或者在当前 PowerShell 策略允许的情况下运行：

```powershell
.\install-claude-context-bar.ps1
```

## 指定扩展目录

默认会自动查找最新的 Claude Code 扩展目录。需要手动指定时，把扩展目录作为参数传入。

macOS / Linux：

```bash
./install-claude-context-bar.sh "/path/to/anthropic.claude-code-x.y.z-*"
```

Windows：

```powershell
powershell -ExecutionPolicy Bypass -File .\install-claude-context-bar.ps1 "C:\Users\you\.cursor\extensions\anthropic.claude-code-x.y.z-win32-x64"
```

也可以直接调用主脚本：

```bash
node apply-context-bar.js "/path/to/anthropic.claude-code-x.y.z-*"
```

## 应用后生效

脚本运行成功后，需要刷新 Claude Code 扩展界面：

1. 在 Cursor / VS Code 命令面板执行 `Developer: Reload Window`
2. 或者直接重启 Cursor / VS Code

## 扩展更新后

Claude Code 扩展更新后，扩展目录通常会变成新的版本号，之前写入的 UI 改动也可能被新版本覆盖。

遇到这种情况，重新运行安装脚本即可。脚本会重新查找最新扩展并应用改动。

## 许可证

本项目使用 [MIT License](LICENSE)。
