#!/bin/bash
echo "===================================="
echo "Setting up Automotive-Stock-Catalog"
echo "===================================="
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "Error: Failed to install dependencies"
  exit 1
fi
echo "Setup completed successfully!" 