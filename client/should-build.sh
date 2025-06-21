#!/bin/bash

# Exit codes:
# 0 - Skip build (no changes in client)
# 1 - Proceed with build (changes detected in client)

# Only build from main branch
if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then
  echo "🚫 Skipping build: Not on main branch"
  exit 0
fi

# Check if there are changes in client directory or related files
CLIENT_CHANGES=$(git diff --name-only HEAD^ HEAD | grep -E '^client/|^package\.json$|^\.github/' | wc -l)

if [ "$CLIENT_CHANGES" -eq 0 ]; then
  echo "🚫 Skipping build: No changes in client directory"
  exit 0
else
  echo "✅ Proceeding with build: $CLIENT_CHANGES file(s) changed in client"
  exit 1
fi