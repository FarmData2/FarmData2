# Rewrite the URLs to the live component examples in the
# markdown files in docs/components so that they open correctly
# where the devcontainer is currently running.
function rewriteCompDocsExURL {

  REPO_DIR=$(git rev-parse --show-toplevel)

  # Determine the new host name to use in the URLs based on the environment.
  if [[ -n "$CODESPACE_NAME" ]]; then
    # Containers are running in a GitHub Codespace.
    NEW_HOST="$CODESPACE_NAME-443.app.github.dev"
  else
    # Containers are running in a local Docker instance.
    NEW_HOST="localhost"
  fi

  # Rewrite the URLs in the markdown files.
  CWD=$(pwd)
  cd "$REPO_DIR/docs/components" || echo "$REPO_DIR/docs/components does not exist."

  FIRST_REWRITE=$(grep -rl 'href=\"https:\/\/%HOST_NAME%\/fd2_examples\/' .)
  CURRENTLY_LOCALHOST=$(grep -rl 'href=\"https:\/\/localhost\/fd2_examples\/' .)
  CURRENTLY_127001=$(grep -rl 'href=\"https:\/\/127.0.0.1\/fd2_examples\/' .)
  CURRENTLY_CODESPACE=$(grep -rl 'href=\"https:\/\/.*app\.github\.dev\/fd2_examples\/' .) 

  if [[ -n $FIRST_REWRITE ]]; then
    # Handle the %HOST_NAME% from the source files if the docs were just generated.
    grep -rl 'href=\"https:\/\/%HOST_NAME%\/fd2_examples\/' . | xargs sed -i "s/%HOST_NAME%/$NEW_HOST/g"
  elif [[ -n $CURRENTLY_LOCALHOST ]]; then
    # Handle the case where we rewrote to localhost earlier.
    grep -rl 'href=\"https:\/\/localhost\/fd2_examples\/' . | xargs sed -i "s/href=\"https:\/\/localhost\/fd2_examples\//href=\"https:\/\/$NEW_HOST\/fd2_examples\//g"
  elif [[ -n $CURRENTLY_127001 ]]; then
    # Handle the case where we rewrote to 127.0.0.1 earlier.
    grep -rl 'href=\"https:\/\/127.0.0.1\/fd2_examples\/' . | xargs sed -i "s/href=\"https:\/\/127.0.0.1\/fd2_examples\//href=\"https:\/\/$NEW_HOST\/fd2_examples\//g"
  elif [[ -n $CURRENTLY_CODESPACE ]]; then
    # Handle the case where we rewrote to the Codespace name earlier.
    grep -rl 'href=\"https:\/\/.*app\.github\.dev\/fd2_examples\/' . | xargs sed -i "s/href=\"https:\/\/.*app\.github\.dev\/fd2_examples\//href=\"https:\/\/$NEW_HOST\/fd2_examples\//g"
  else
    echo "ERROR: No component example URLs were found to be rewritten."
  fi

  cd "$CWD" || echo "Could not return to $CWD."
}
