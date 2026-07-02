#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

run_vercel() {
  if command -v vercel >/dev/null 2>&1; then
    vercel "$@"
    return
  fi

  if command -v bunx >/dev/null 2>&1; then
    bunx vercel "$@"
    return
  fi

  if command -v npx >/dev/null 2>&1; then
    npx vercel "$@"
    return
  fi

  echo "Error: Vercel CLI not found. Install it with 'bun add -g vercel' or 'npm i -g vercel'."
  exit 1
}

# Step 1: Push latest changes to GitHub
echo "Pushing changes to GitHub..."
git push
echo "Changes pushed to GitHub successfully."

# Step 2: Build the site locally
echo "Building the site locally from committed changes..."
bun run build
echo "Site built successfully."

# Step 3: Deploy to Vercel
echo "Deploying to Vercel production..."
run_vercel --prod
echo "Deployment to Vercel completed!"
