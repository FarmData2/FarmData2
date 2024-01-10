#!/bin/bash

# Define valid types
VALID_TYPES=("build" "chore" "ci" "docs" "feat" "fix" "perf" "refactor" "style" "test")

# Define valid scopes
VALID_SCOPES=("dev" "comp" "lib" "fd2" "examples" "school")

# Function to check if an element is in an array
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

# Function to validate PR title
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

# Main script execution
PR_NUMBER="$1"
if [ -z "$PR_NUMBER" ]; then
    echo "Please provide a PR number."
    exit 1
fi

# Fetch PR title and body using GitHub CLI
echo "Fetching PR #$PR_NUMBER from farmdata2/farmdata2..."
PR_TITLE=$(gh pr view "$PR_NUMBER" --repo farmdata2/farmdata2 --json title --jq '.title')
PR_BODY=$(gh pr view "$PR_NUMBER" --repo farmdata2/farmdata2 --json body --jq '.body')

# Validate PR title
if ! validatePRTitle "$PR_TITLE"; then
    echo "Invalid PR title: $PR_TITLE"
    converted_commit=$(convertToConventionalCommit "$PR_TITLE" "$PR_BODY")
    echo "Suggested conventional commit: $converted_commit"
    exit 1
else
    echo "Valid PR title: $PR_TITLE"
fi

exit 0
