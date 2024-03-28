# shellcheck disable=SC2009
PIDs=$(pgrep -f "vite.config.js")

for pid in $PIDs; do
  echo "Killing process: $pid"
  kill -9 "$pid"
done
