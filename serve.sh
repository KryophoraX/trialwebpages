#!/usr/bin/env bash
# Serve this repo from its root. Run: ./serve.sh

cd "$(dirname "$0")"

PORT="${PORT:-8080}"

while lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

echo ""
echo "  Hayagreeva — local server"
echo "  ─────────────────────────────────────────"
echo "  Site:           http://127.0.0.1:${PORT}/pages/hayagreeva-energy/"
echo "  Hub redirect:   http://127.0.0.1:${PORT}/"
echo "  Archive:        pages/archive/ (not served in menu)"
echo "  ─────────────────────────────────────────"
echo "  Press Ctrl+C to stop"
echo ""

exec python3 -m http.server "$PORT" --bind 127.0.0.1
