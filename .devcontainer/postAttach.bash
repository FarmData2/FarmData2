#!/bin/bash

# This runs each time the project folder is opened in VSCode.
# E.g. on a browser window reload or opening a new window to a running container.

REPO_DIR=$(git rev-parse --show-toplevel)
source "$REPO_DIR/bin/lib/checkServices.lib.bash"

echo ""
echo "The FarmData2 Development Environment is almost ready."
echo "Just a few more things to take care of..."
echo ""

# Note: This is done here becuase installing in devcontainer.json causes race condition
# with npm ci AND the code command must be run in a VSCode Terminal and earlier scripts
# are not.
VSCODE_HASH=$(find ~/.vscode-remote/bin -mindepth 1 -maxdepth 1 -printf '%T@ %f\n' | sort -nr | head -n 1 | cut -d' ' -f2-)
VSCODE_CMD=~/.vscode-remote/bin/"$VSCODE_HASH"/bin/remote-cli/code
mapfile -t VSCODE_EXTENSIONS < <(jq -r '.recommendations[]' "$REPO_DIR/.vscode/extensions.json")
INSTALLED_EXTENSIONS=$($VSCODE_CMD --list-extensions)

MISSING_EXTENSIONS=()
for EXT in "${VSCODE_EXTENSIONS[@]}"; do
  if ! grep -qi "^${EXT}$" <<< "$INSTALLED_EXTENSIONS"; then
    MISSING_EXTENSIONS+=("$EXT")
  fi
done

if ((${#MISSING_EXTENSIONS[@]})); then
  echo "Installing VSCode extensions..."
  for EXT in "${MISSING_EXTENSIONS[@]}"; do
    echo "  Installing $EXT"
    $VSCODE_CMD --install-extension "$EXT" &> /dev/null
  done
  echo "Extensions installed."
  echo ""
fi

# Sometimes on restart we can't connect to the Docker daemon right away.
checkDocker
DOCKER=$?
if ((!DOCKER)); then
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "Could not connect to the Docker daemon."
  echo ""
  echo "Try stopping and restarting the codespace."
  echo "If that does not work try creating a new one."
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
  exit 1
fi

checkPostgres
POSTGRES=$?
if ((POSTGRES)); then
  checkFarmOS
  FARMOS=$?
fi
if (((!POSTGRES) || (!FARMOS))); then
  echo ""
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "One or more of the FarmData2 docker containers is not running."
  echo ""
  echo "Try restarting them with the commands:"
  echo "  cd ~/FarmData2/docker"
  echo "  docker compose down"
  echo "  docker compose -f compose.yml -f compose.codespaces.yml up --detach"
  echo "  docker ps"
  echo ""
  echo "Verify that containers with the following NAMES are running:"
  echo "  fd2_postgres"
  echo "  fd2_farmos"
  echo "  fd2_nginx"
  echo ""
  echo "Then use the commands:"
  echo "  cd ~/FarmData2"
  echo "  .devcontainer/postAttach.bash"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
  exit 1
fi

checkDocs
DOCS=$?
if ((!DOCS)); then
  echo ""
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "The FarmData2 documentation server did not start."
  echo ""
  echo "It can be started manually with the command:"
  echo "  npm run docs:view"
  echo ""
  echo "Then use the command:"
  echo "  .devcontainer/postAttach.bash"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
fi

checkNoVNC
NOVNC=$?
if ((!NOVNC)); then
  echo ""
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "The noVNC server is not running."
  echo ""
  echo "You will not be able to run Cypress tests in the GUI"
  echo "If this is reqiured try stopping and restarting the codespace."
  echo "If that does not work try creating a new one."
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
fi

# Print out links here so that VSCode picks them up and exposes the ports.
PROXY_PORT=$(docker port fd2_nginx | cut -d':' -f2 | head -1)
echo ""
echo "==============================================="
echo "The FarmData2 Development Environment is ready."
echo ""
echo "The following are available in the PORTS tab:"
echo "  farmOS: https://localhost:${PROXY_PORT}"
if ((NOVNC)); then
  echo "  noVNC: http://localhost:6901"
fi
if ((DOCS)); then
  echo "  docs: http://localhost:8082"
fi
echo ""
echo "Happy coding!"
echo "==============================================="
echo ""
