#!/bin/bash
echo "===================================="
echo "Building Automotive-Stock-Catalog"
echo "===================================="
echo "Building application..."
npm run build
if [ $? -ne 0 ]; then
  echo "Error: Build failed"
  exit 1
fi
echo "Build completed successfully!" 