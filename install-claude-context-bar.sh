#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_JS="$SCRIPT_DIR/apply-context-bar.js"

echo "========================================"
echo " Claude Code Context Bar"
echo "========================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node was not found in PATH."
  echo "Please install Node.js first, then run this script again."
  exit 1
fi

if [[ ! -f "$SCRIPT_JS" ]]; then
  echo "Error: installer script not found: $SCRIPT_JS"
  exit 1
fi

echo "Applying changes..."
node "$SCRIPT_JS" "$@"

echo ""
echo "Done."
echo "Reload Cursor / VS Code to see the context usage bar:"
echo "- Command Palette: Developer: Reload Window"
echo "- or restart Cursor / VS Code"
echo ""
