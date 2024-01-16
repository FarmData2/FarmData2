# shellcheck disable=SC2009
PIDs=$(ps -aux | grep "vite.config.js build --watch$" | tr -s " " | cut -d " " -f 2)

for pid in $PIDs; do
  echo "Killing process: $pid"
  kill -9 "$pid"
done
