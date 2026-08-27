#!/usr/bin/env bash
# Serve this repo from its root. Run: ./serve.sh

cd "$(dirname "$0")"

PORT="${PORT:-8080}"

while lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

echo ""
echo "  Trial Web Pages — local server"
echo "  ─────────────────────────────────────────"
echo "  Hub:            http://127.0.0.1:${PORT}/"
echo "  Hayagreeva:     http://127.0.0.1:${PORT}/pages/hayagreeva-energy/"
echo "  Liquid Glass:   http://127.0.0.1:${PORT}/pages/hayagreeva-liquid-glass/"
echo "  Hayagreeva Orb: http://127.0.0.1:${PORT}/pages/daynight-style/"
echo "  Noctra:         http://127.0.0.1:${PORT}/pages/hayagreeva-noctra/"
echo "  Kaiko:          http://127.0.0.1:${PORT}/pages/hayagreeva-kaiko/"
echo "  Flare:          http://127.0.0.1:${PORT}/pages/hayagreeva-flare/"
echo "  ─────────────────────────────────────────"
echo "  Press Ctrl+C to stop"
echo ""

exec python3 -m http.server "$PORT" --bind 127.0.0.1
