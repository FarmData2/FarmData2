#!/bin/bash

# Define valid types
VALID_TYPES=("build" "chore" "ci" "docs" "feat" "fix" "perf" "refactor" "style" "test")

# Define valid scopes
VALID_SCOPES=("dev" "comp" "lib" "fd2" "examples" "school")

# Small helper array checker function.
elementInArray() {
    local element
    local match="$1"
    shift
    for element; do
        [[ "$element" == "$match" ]] && return 0
    done
    return 1
}

# Function to convert PR title and body to a conventional commit format
convertToConventionalCommit() {
    local pr_title="$1"
    local pr_body="$2"

    # Basic conversion logic (can be expanded as needed)
    local type=$(echo "$pr_title" | cut -d':' -f1)
    local description="$pr_title"

    # Default scope to 'core' if not provided
    local scope="core"
    if [[ "$pr_title" == *"("*")"* ]]; then
        scope=$(echo "$pr_title" | cut -d'(' -f2 | cut -d')' -f1)
        description=$(echo "$pr_title" | cut -d')' -f2-)
    fi

    # Construct the conventional commit message
    local conventional_commit="${type}(${scope}): ${description}"
    if [ -n "$pr_body" ]; then
        conventional_commit="${conventional_commit} - ${pr_body}"
    fi
    echo "$conventional_commit"
}

# PR Validation
validatePRTitle() {
    local pr_title="$1"

    # Extract type and scope from PR title
    local type=$(echo "$pr_title" | cut -d':' -f1)
    local scope=$(echo "$pr_title" | cut -d'(' -f2 | cut -d')' -f1)

    # Check if type is valid
    if ! elementInArray "$type" "${VALID_TYPES[@]}"; then
        echo "Invalid commit type: $type"
        return 1
    fi

    # Check if scope is valid
    if ! elementInArray "$scope" "${VALID_SCOPES[@]}"; then
        echo "Invalid commit scope: $scope"
        return 1
    fi

    echo "PR title is valid."
    return 0
}

# Function to check GitHub CLI authentication
checkGhCliAuth() {
    echo "Checking GitHub CLI Authentication status."
    if ! gh auth status > /dev/null 2>&1; then
        echo "You are not logged in to the GitHub CLI."
        echo "Attempting to log in..."
        gh auth login
        if [ $? -ne 0 ]; then
            echo "GitHub CLI login failed. Please try again manually."
            exit 1
        fi
    else
        echo "You are already logged in to the GitHub CLI."
    fi
}

# Perform a squash merge with a conventional commit message
squashMergePR() {
    local pr_number="$1"
    local commit_message="$2"
    local repo="farmdata2/farmdata2" # Default repository. Possible to add a working current repository to manage multiple and set it as an env var perhaps in the future.

    # Perform the squash merge
    gh pr merge "$pr_number" --repo "$repo" --squash --commit-title "$commit_message"

    if [ $? -eq 0 ]; then
        echo "Successfully squash merged PR #$pr_number."
    else
        echo "Failed to squash merge PR #$pr_number."
        return 1
    fi
}

# Main script execution

# Checks for GitHub CLI Authentication
checkGhCliAuth

# PR Retrieval
PR_NUMBER="$1"
if [ -z "$PR_NUMBER" ]; then
    echo "Please provide a PR number."
    exit 1
fi

# This section is a current work in progress.
# Any feedback would be appreciated!
# I wasn't sure about the converted commit format but this is just a sample implementation

# Fetch PR title and body using GitHub CLI
echo "Fetching PR #$PR_NUMBER from farmdata2/farmdata2..."
PR_TITLE=$(gh pr view "$PR_NUMBER" --repo farmdata2/farmdata2 --json title --jq '.title')
PR_BODY=$(gh pr view "$PR_NUMBER" --repo farmdata2/farmdata2 --json body --jq '.body')

# Aftermath - validating the PR title - this is a WIP. 
if ! validatePRTitle "$PR_TITLE"; then
    echo "Invalid PR title: $PR_TITLE"
    converted_commit=$(convertToConventionalCommit "$PR_TITLE" "$PR_BODY")
    echo "Suggested conventional commit: $converted_commit"
    
    # Optional: Prompt for confirmation before performing the squash merge
    read -p "Do you want to squash merge this PR with the above commit message? (y/n) " confirm
    if [[ $confirm == [yY] ]]; then
        squashMergePR "$PR_NUMBER" "$converted_commit"
    fi

    exit 1
else
    echo "Valid PR title: $PR_TITLE"
    converted_commit=$(convertToConventionalCommit "$PR_TITLE" "$PR_BODY")
    
    # Perform the squash merge with the valid commit message
    squashMergePR "$PR_NUMBER" "$converted_commit"
fi

exit 0
