#!/usr/bin/env bash

# NOTE: Must be separate from Husky scripts as Husky only supports running sh scripts...

# Inspects branch name and checks if it contains a GitHub issue number (i.e. #123).
#   If so, commit message will be automatically prepended with [#123].
#
# Source: https://medium.com/bytelimes/automate-issue-numbers-in-git-commit-messages-2790ae6fe071

branch_name=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

# Ensure branch_name is not empty and is not in a detached HEAD state (i.e. rebase).
# SKIP_PREPARE_COMMIT_MSG may be used as an escape hatch to disable this hook,
#   while still allowing other githooks to run.
if [ ! -z "$branch_name" ] && [ "$branch_name" != "HEAD" ] && [ "$SKIP_PREPARE_COMMIT_MSG" != 1 ]; then
  prefix_pattern='[0-9]{1,4}'

  [[ $branch_name =~ $prefix_pattern ]]

  prefix=${BASH_REMATCH[0]}
  prefix_in_commit=$(grep -c "\[#$prefix\]" $1)

  if ! [[ -n "$prefix" ]]; then
    echo "Branch name does not contain an issue number"
    exit 1
  fi

  # Avoid adding prefix to message more than once
  if ! [[ $prefix_in_commit -ge 1 ]]; then
    sed -i.bak -e "1s~^~[#$prefix] ~" $1
  fi
fi
