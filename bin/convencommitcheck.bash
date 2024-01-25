#!/bin/bash

# Define valid types and scopes
VALID_TYPES=("build" "chore" "ci" "docs" "feat" "fix" "perf" "refactor" "style" "test")
VALID_SCOPES=("dev" "comp" "lib" "fd2" "examples" "school" "none") # Added 'none' for no scope

# Helper function to check if an element is in an array
elementInArray() {
    local element
    for element in "${@:2}"; do
        [[ "$element" == "$1" ]] && return 0
    done
    return 1
}

# Function to prompt for a value with a default
promptForValue() {
    local prompt=$1
    local default=$2
    read -p "$prompt [$default]: " value
    echo "${value:-$default}"
}

# Function to convert PR title to conventional commit format
convertToConventionalCommit() {
    local type=$1
    local scope=$2
    local description=$3
    local body=$4
    local breaking_change=$5

    local commit_message="${type}"
    if [[ "$scope" != "none" ]]; then
        commit_message="${commit_message}(${scope})"
    fi
    commit_message="${commit_message}: ${description}"

    if [[ "$breaking_change" == "yes" ]]; then
        commit_message="${commit_message}\n\nBREAKING CHANGE: ${body}"
    else
        commit_message="${commit_message}\n\n${body}"
    fi

    echo "$commit_message"
}

# Function to check and handle GitHub CLI authentication
checkGhCliAuth() {
    echo "Checking GitHub CLI Authentication status..."
    if ! gh auth status > /dev/null 2>&1; then
        echo "You are not logged in to the GitHub CLI. Logging in..."
        gh auth login || { echo "GitHub CLI login failed. Please try again manually."; exit 1; }
    else
        echo "Logged in to the GitHub CLI."
    fi
}

# Function to perform a squash merge
squashMergePR() {
    local pr_number=$1
    local commit_message=$2
    local repo="farmdata2/farmdata2" # Default repository

    gh pr merge "$pr_number" --repo "$repo" --squash --commit-title "$commit_message" && \
    echo "Successfully merged PR #$pr_number." || \
    { echo "Failed to merge PR #$pr_number."; return 1; }
}

# Script starts here

checkGhCliAuth

# Prompt for PR number if not provided
PR_NUMBER=${1:-$(promptForValue "Enter PR number" "")}
[ -z "$PR_NUMBER" ] && { echo "PR number is required."; exit 1; }

# Fetch PR title and body
echo "Fetching PR #$PR_NUMBER..."
PR_TITLE=$(gh pr view "$PR_NUMBER" --repo farmdata2/farmdata2 --json title --jq '.title')
PR_BODY=$(gh pr view "$PR_NUMBER" --repo farmdata2/farmdata2 --json body --jq '.body')

# Extract type, scope, and description from PR title
TYPE=$(echo "$PR_TITLE" | cut -d':' -f1)
SCOPE=$(echo "$PR_TITLE" | cut -d'(' -f2 | cut -d')' -f1)
DESCRIPTION=$(echo "$PR_TITLE" | cut -d')' -f2- | cut -d':' -f2-)

# Validate and prompt for type and scope
TYPE=${TYPE:-$(promptForValue "Enter commit type" "feat")}
if ! elementInArray "$TYPE" "${VALID_TYPES[@]}"; then
    echo "Invalid commit type: $TYPE. Please enter a valid type."
    exit 1
fi

SCOPE=${SCOPE:-$(promptForValue "Enter commit scope" "none")}
if ! elementInArray "$SCOPE" "${VALID_SCOPES[@]}"; then
    echo "Invalid commit scope: $SCOPE. Please enter a valid scope."
    exit 1
fi

# Prompt for breaking change
BREAKING_CHANGE=$(promptForValue "Is this a breaking change (yes/no)" "no")

# Generate the conventional commit message
CONV_COMMIT=$(convertToConventionalCommit "$TYPE" "$SCOPE" "$DESCRIPTION" "$PR_BODY" "$BREAKING_CHANGE")

# Provide options to accept or edit the commit message
echo "Proposed commit message:"
echo "$CONV_COMMIT"
read -p "Do you want to (A)ccept, (E)dit, or (C)ancel? " choice
case $choice in
    [Ee]* ) nano <<< "$CONV_COMMIT";;
    [Cc]* ) exit;;
esac

# Perform the squash merge
squashMergePR "$PR_NUMBER" "$CONV_COMMIT"
