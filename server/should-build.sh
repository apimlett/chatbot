#!/bin/bash

# Exit codes:
# 0 - Skip build (no changes in server)
# 1 - Proceed with build (changes detected in server)

# Only build from main branch
if [ "$RAILWAY_GIT_BRANCH" != "main" ]; then
  echo "🚫 Skipping build: Not on main branch"
  exit 0
fi

# Check if there are changes in server directory or related files
SERVER_CHANGES=$(git diff --name-only HEAD^ HEAD | grep -E '^server/|^package\.json$|^\.github/' | wc -l)

if [ "$SERVER_CHANGES" -eq 0 ]; then
  echo "🚫 Skipping build: No changes in server directory"
  exit 0
else
  echo "✅ Proceeding with build: $SERVER_CHANGES file(s) changed in server"
  exit 1
fi