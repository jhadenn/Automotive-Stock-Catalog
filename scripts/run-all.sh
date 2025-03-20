#!/bin/bash
echo "===================================="
echo "Automotive-Stock-Catalog: Full Setup"
echo "===================================="
echo "Step 1: Setup"
./scripts/setup.sh
if [ $? -ne 0 ]; then exit 1; fi

echo "Step 2: Build"
./scripts/build.sh
if [ $? -ne 0 ]; then exit 1; fi

echo "Step 3: Test"
./scripts/test.sh
if [ $? -ne 0 ]; then exit 1; fi

echo "===================================="
echo "Setup completed successfully!"
echo "To start the development server, run:"
echo "  ./scripts/dev.sh"
echo "====================================" 