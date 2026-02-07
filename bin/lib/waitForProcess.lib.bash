# Print out . on a line until the process with 
# the given PID exits.
#
# Usage example:
#   cmd_to_run 2> /dev/null &
#   PID=$!
#   waitForProcess $PID 3
#
function waitForProcess {
  PID=$1
  WAIT=$2
  while kill -0 "$PID" 2> /dev/null; do
    echo -n "."
    sleep "$WAIT"
  done
}