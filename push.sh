#!/bin/bash
# Git push script for FableTech repository

REPO_URL="https://github.com/JACKHU0006/fabletech.git"

echo "Attempting to push to $REPO_URL"
echo ""

# Try with different approaches
echo "Approach 1: Direct git push"
GIT_ASKPASS=true git push "$REPO_URL" main 2>&1 || echo "Approach 1 failed"

echo ""
echo "Approach 2: Using credential helper"
git config credential.helper store
git push "$REPO_URL" main 2>&1 || echo "Approach 2 failed"

echo ""
echo "Please use the following command manually in your terminal:"
echo "cd $(pwd) && git push fabletech main"
