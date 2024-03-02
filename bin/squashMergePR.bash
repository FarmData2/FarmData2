#!/bin/bash

# Define valid types and scopes
VALID_TYPES=("build" "chore" "ci" "docs" "feat" "fix" "perf" "refactor" "style" "test")
VALID_SCOPES=("dev" "comp" "lib" "fd2" "examples" "school" "none") # Added 'none' for no scope 

# Default values for flags
TYPE=""
SCOPE=""
PR_NUMBER=""
DESCRIPTION=""
PR_BODY=""
BREAKING_CHANGE="no" # Safe to assume no breaking changes by default.
BREAKING_CHANGE_DESCRIPTION=""
REPO_URL=""

# Help function
displayHelp() {
    echo "Usage: $0 [options] [--pr-number <PR number>]"
    echo ""
    echo "Options:"
    echo "  --type <type>                           Type of commit (e.g., feat, fix)."
    echo "  --scope <scope>                         Scope of the commit (e.g., lib, none)."
    echo "  --description <description>             Description of the commit."
    echo "  --body <body>                           Body of the commit message."
    echo "  --breaking-change <yes|no>              Specify if the commit introduces a breaking change."
    echo "  --breaking-change-description <desc>    Description of the breaking change."
    echo "  --repo <GitHub repo URL>                GitHub repository URL. Supports HTTPS, SSH, and '.git' links (e.g., https://github.com/FarmData2/FarmData2, git@github.com:FarmData2/FarmData2.git)."
    echo "  --pr-number <PR number>                 The number of the pull request to merge."
    echo "  --help                                  Display this help message and exit."
    echo ""
    echo "If required options are not provided via command-line arguments,"
    echo "interactive prompts will be used to gather necessary information."
    echo ""
    echo "Example:"
    echo "  $0 --type feat --scope lib --description \"Add new feature\" --pr-number 123 --repo https://github.com/user/repo"
    echo ""
    echo "This script uses the GitHub CLI (gh) and expects it to be installed and authenticated."
}

# Parse command line options
while [[ $# -gt 0 ]]; do
    case $1 in
        --type) TYPE="$2"; shift 2 ;;
        --scope) SCOPE="$2"; shift 2 ;;
        --description) DESCRIPTION="$2"; shift 2 ;;
        --body) PR_BODY="$2"; shift 2 ;;
        --breaking-change) BREAKING_CHANGE="$2"; shift 2 ;;
        --breaking-change-description) BREAKING_CHANGE_DESCRIPTION="$2"; shift 2 ;;
        --repo) REPO_URL="$2"; shift 2 ;;
        --pr-number) PR_NUMBER="$2"; shift 2 ;;
        --help) displayHelp; exit 0 ;;
        *) echo "Unknown option: $1"; displayHelp; exit 1 ;;
    esac
done


# Helper function to check if an element is in an array
elementInArray() {
    local element
    shopt -s nocasematch 
    for element in "${@:2}"; do
        [[ "$element" == "$1" ]] && { shopt -u nocasematch; return 0; } 
    done
    shopt -u nocasematch 
    return 1
}

# Helper function to print an array
printArray() {
    local arr=("$@")
    for item in "${arr[@]}"; do
        echo " - $item"
    done
}

# Helper function to prompt for a value with a default, displaying valid options and requiring valid input
promptForValue() {
    local prompt=$1
    local default=$2
    local -n validOptions=$3 # Using nameref for indirect reference to the array
    local value
    while true; do
        echo "$prompt"
        if [[ -n ${validOptions} ]]; then
            echo "Valid options are:"
            for item in "${validOptions[@]}"; do
                echo " - $item"
            done
        fi
        read -p "Your choice [$default]: " value
        value="${value:-$default}"
        if [[ " ${validOptions[*]} " =~ " ${value} " || "$value" == "$default" ]]; then
            echo "$value"
            return 0 
        else
            echo "Invalid input: '$value'. Please enter a valid value."
        fi
    done
}
# Function to convert PR title to conventional commit format
convertToConventionalCommit() {
    local type=$1
    local scope=$2
    local description=$3
    local body=$4
    local breaking_change=$5
    local breaking_change_description=$6 
    local commit_message="${type}" 
    
    if [[ "$scope" != "none" ]]; then
        commit_message="${commit_message}(${scope})"
    fi 
    
    commit_message="${commit_message}: ${description}"
    
    if [[ "$breaking_change" == "yes" && -n "$breaking_change_description" ]]; then
        commit_message="${commit_message}\n\nBREAKING CHANGE: ${breaking_change_description}"
    elif [[ "$breaking_change" == "yes" ]]; then
        commit_message="${commit_message}\n\n${body}"
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
    local repo=$3 # Use passed repository information

    echo "Attempting to merge PR #$pr_number into $repo..."
    gh pr merge "$pr_number" --repo "$repo" --squash --commit-title "$commit_message" && \
    echo "Successfully merged PR #$pr_number into $repo." || \
    { echo "Failed to merge PR #$pr_number into $repo."; return 1; }
}

# Function to check for external dependencies
checkDependencies() {
    if ! command -v gh &> /dev/null; then
        echo "GitHub CLI (gh) could not be found. Please install it to continue."
        exit 1
    fi
}

# Run the dependency check (Pre entrypoint)
checkDependencies

# Main Entrypoint (Beginning with gh auth check)
checkGhCliAuth

# Extract repository info from URL or current git context 
if [[ -n "$REPO_URL" ]]; then
    if [[ "$REPO_URL" =~ git@github.com:(.+)/(.+)\.git ]]; then
        # SSH format URL
        REPO="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    elif [[ "$REPO_URL" =~ https://github.com/(.+)/(.+)(\.git)? ]]; then
        # HTTPS format URL, with optional .git suffix
        REPO="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    else
        echo "Error: Unable to parse GitHub repository URL."
        exit 1
    fi
elif git rev-parse --git-dir > /dev/null 2>&1; then
    # Attempt to extract from current git repository if in a git directory
    REPO_URL=$(git remote get-url origin)
    if [[ "$REPO_URL" =~ git@github.com:(.+)/(.+)\.git ]]; then
        REPO="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    elif [[ "$REPO_URL" =~ https://github.com/(.+)/(.+)(\.git)? ]]; then
        REPO="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    else
        echo "Error: Unable to parse origin URL of the current git repository."
        exit 1
    fi
else
    echo "Error: Repository URL is required if not in a git repository folder."
    exit 1
fi

# Interactive prompt for PR_NUMBER if not provided via CLI
if [ -z "$PR_NUMBER" ]; then
    echo "Enter the Pull Request (PR) number you wish to merge:"
    read -r PR_NUMBER
    if ! [[ "$PR_NUMBER" =~ ^[0-9]+$ ]]; then
        echo "Error: PR number must be a positive integer."
        exit 1
    fi
fi

# Fetch PR title and body if not provided via CLI flags
if [ -z "$PR_TITLE" ] && [ -z "$PR_BODY" ] && [ -n "$PR_NUMBER" ]; then
    echo "Fetching PR #$PR_NUMBER details..."
    PR_TITLE=$(gh pr view "$PR_NUMBER" --repo "$REPO" --json title --jq '.title')
    PR_BODY=$(gh pr view "$PR_NUMBER" --repo "$REPO" --json body --jq '.body')
fi

# Extract type, scope, and description from PR if not provided via CLI flags
if [ -z "$TYPE" ] || [ -z "$SCOPE" ] || [ -z "$DESCRIPTION" ]; then
    echo "Extracting commit details from PR title..."
    TYPE=$(echo "$PR_TITLE" | cut -d':' -f1 | tr '[:upper:]' '[:lower:]')
    SCOPE=$(echo "$PR_TITLE" | cut -d'(' -f2 | cut -d')' -f1 | tr '[:upper:]' '[:lower:]')
    DESCRIPTION=$(echo "$PR_TITLE" | cut -d')' -f2- | cut -d':' -f2-)
fi

# Interactive prompts for TYPE, SCOPE, DESCRIPTION if still needed
if [ -z "$TYPE" ]; then
    promptForValue "Enter commit type" "feat" VALID_TYPES
fi

if [ -z "$SCOPE" ]; then
    promptForValue "Enter commit scope" "none" VALID_SCOPES
fi

if [ -z "$DESCRIPTION" ]; then
    echo "Enter commit description:"
    read DESCRIPTION
fi

# Handle BREAKING_CHANGE flag interactively if not set
if [ -z "$BREAKING_CHANGE" ]; then
    promptForValue "Is this a breaking change (yes/no)" "no"
fi

# Prompt for breaking change description if necessary
if [[ "$BREAKING_CHANGE" == "yes" && -z "$BREAKING_CHANGE_DESCRIPTION" ]]; then
    if [[ "$PR_BODY" =~ "BREAKING CHANGE:" ]]; then
        BREAKING_CHANGE_DESCRIPTION=$(echo "$PR_BODY" | sed -n '/BREAKING CHANGE:/,$p')
        echo "Breaking changes found and appended to commit."
    else
        echo "You indicated this is a breaking change. Please provide a specific description of the breaking change."
        read -p "Enter breaking change description: " BREAKING_CHANGE_DESCRIPTION
    fi
fi

# Generate the conventional commit message
CONV_COMMIT=$(convertToConventionalCommit "$TYPE" "$SCOPE" "$DESCRIPTION" "$PR_BODY" "$BREAKING_CHANGE" "$BREAKING_CHANGE_DESCRIPTION")

# Review, edit, or cancel the commit message
echo "Proposed commit message:"
echo "$CONV_COMMIT"
echo "Do you want to (A)ccept, (E)dit, or (C)ancel? "
read -p "[A/e/c]: " choice

case $choice in
    [Ee]* )
        TMPFILE=$(mktemp)
        echo "$CONV_COMMIT" > "$TMPFILE"
        nano "$TMPFILE"
        CONV_COMMIT=$(cat "$TMPFILE")
        rm "$TMPFILE"
        ;;
    [Cc]* ) 
        echo "Operation cancelled."
        exit 0
        ;;
    * ) 
        echo "Accepting commit and beginning squash merge."
        ;;
esac

# Perform the squash merge 
squashMergePR "$PR_NUMBER" "$CONV_COMMIT" "$REPO"
