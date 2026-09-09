#!/data/data/com.termux/files/usr/bin/bash
cd "$(dirname "$0")"

SERVER_PID=""

iniciar_servidor() {
  node server.js &
  SERVER_PID=$!
  echo "Servidor iniciado (PID $SERVER_PID)"
}

detener_servidor() {
  if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID"
    wait "$SERVER_PID" 2>/dev/null
  fi
}

trap detener_servidor EXIT

iniciar_servidor

while true; do
  git fetch origin main >/dev/null 2>&1
  LOCAL=$(git rev-parse HEAD 2>/dev/null)
  REMOTE=$(git rev-parse origin/main 2>/dev/null)

  if [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
    echo "Cambios detectados en GitHub, actualizando..."
    detener_servidor
    git pull origin main
    npm install --production
    iniciar_servidor
  fi

  sleep 30
done