#!/bin/bash
# 01_install_npm_dependencies.sh
# Attempts to install npm dependencies, retrying up to 3 times in case of failure.

echo "Starting npm install with retries..."

max_attempts=3
count=0

until [ $count -ge $max_attempts ]
do
  npm install --omit=dev && echo "npm install succeeded." && break
  count=$[$count+1]
  echo "Attempt $count of $max_attempts failed, retrying..."
  sleep 5  # Waits 5 seconds before retrying to avoid hammering the network/server
done

if [ $count -eq $max_attempts ]; then
  echo "npm install failed after $max_attempts attempts."
  exit 1  # Exit with an error status if npm install fails after max attempts
fi
