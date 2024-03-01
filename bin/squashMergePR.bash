#!/bin/bash

# Define valid types and scopes
VALID_TYPES=("build" "chore" "ci" "docs" "feat" "fix" "perf" "refactor" "style" "test")
VALID_SCOPES=("dev" "comp" "lib" "fd2" "examples" "school" "none") # Added 'none' for no scope

# Default values for flags
TYPE=""
SCOPE=""
DESCRIPTION=""
PR_BODY=""
BREAKING_CHANGE="no"
BREAKING_CHANGE_DESCRIPTION=""
REPO_URL=""

# Function to display help
displayHelp() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --type <type>                            Type of commit (e.g., feat, fix)"
    echo "  --scope <scope>                          Scope of the commit (e.g., lib, none)"
    echo "  --description <description>              Description of the commit"
    echo "  --body <body>                            Body of the commit message"
    echo "  --breaking-change <yes|no>               Specify if the commit introduces a breaking change"
    echo "  --breaking-change-description <desc>     Description of the breaking change"
    echo "  --repo <GitHub repo URL>                 GitHub repository URL (e.g., https://github.com/user/repo)"
    echo "  --help                                   Display this help and exit"
    echo ""
    echo "Interactive prompts will be used for missing required options."
}

# Parse command line options
while [[ $# -gt 0 ]]; do
    case $1 in
        --type) TYPE="$2"; shift ;;
        --scope) SCOPE="$2"; shift ;;
        --description) DESCRIPTION="$2"; shift ;;
        --body) PR_BODY="$2"; shift ;;
        --breaking-change) BREAKING_CHANGE="$2"; shift ;;
        --breaking-change-description) BREAKING_CHANGE_DESCRIPTION="$2"; shift ;;
        --repo) REPO_URL="$2"; shift ;;
        --help) displayHelp; exit 0 ;;
        *) echo "Unknown option: $1"; displayHelp; exit 1 ;;
    esac
    shift
done

# Extract repository info from URL or current git context
if [[ -n "$REPO_URL" ]]; then
    REPO=$(echo "$REPO_URL" | grep -oP '(?<=github.com/).+')
elif git rev-parse --git-dir > /dev/null 2>&1; then
    REPO=$(git remote get-url origin | grep -oP '(?<=github.com/).+')
else
    echo "Error: Repository URL is required if not in a git repository folder."
    exit 1
fi

# Helper function to check if an element is in an array
elementInArray() {
    local element
    shopt -s nocasematch # Enable case-insensitive matching
    for element in "${@:2}"; do
        [[ "$element" == "$1" ]] && { shopt -u nocasematch; return 0; } 
    done
    shopt -u nocasematch # Disable case-insensitive matching
    return 1
}

# Helper function to print an array
printArray() {
    local arr=("$@")
    for item in "${arr[@]}"; do
        echo " - $item"
    done
}


# Function to prompt for a value with a default, displaying valid options and requiring valid input
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
    local repo="farmdata2/farmdata2" # Default repository

    gh pr merge "$pr_number" --repo "$repo" --squash --commit-title "$commit_message" && \
    echo "Successfully merged PR #$pr_number." || \
    { echo "Failed to merge PR #$pr_number."; return 1; }
}
# Entrypoint after main
checkGhCliAuth

# Check for git 

# Prompt for PR number if not provided
PR_NUMBER=${1:-$(promptForValue "Enter PR number" "")}
[ -z "$PR_NUMBER" ] && { echo "PR number is required."; exit 1; }

# Fetch PR title and body
echo "Fetching PR #$PR_NUMBER..."
PR_TITLE=$(gh pr view "$PR_NUMBER" --repo farmdata2/farmdata2 --json title --jq '.title')
PR_BODY=$(gh pr view "$PR_NUMBER" --repo farmdata2/farmdata2 --json body --jq '.body')

# Extract type, scope, and description from PR 
TYPE=$(echo "$PR_TITLE" | cut -d':' -f1 | tr '[:upper:]' '[:lower:]')
SCOPE=$(echo "$PR_TITLE" | cut -d'(' -f2 | cut -d')' -f1 | tr '[:upper:]' '[:lower:]')
DESCRIPTION=$(echo "$PR_TITLE" | cut -d')' -f2- | cut -d':' -f2-)

# TYPE and SCOPE prompts (validation done in pfv function)
TYPE=$(promptForValue "Enter commit type" "feat" VALID_TYPES)
SCOPE=$(promptForValue "Enter commit scope" "none" VALID_SCOPES)

# Prompt for breaking change and check for existing breaking change description
BREAKING_CHANGE=$(promptForValue "Is this a breaking change (yes/no)" "no")
BREAKING_CHANGE_DESCRIPTION=""

if [[ "$BREAKING_CHANGE" == "yes" ]]; then
    # Check if the PR body already contains a BREAKING CHANGE footer and extract it if present in PR body
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
