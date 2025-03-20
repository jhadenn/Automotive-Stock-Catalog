#!/bin/bash
echo "===================================="
echo "Running tests"
echo "===================================="
npm test
if [ $? -ne 0 ]; then
  echo "Warning: Some tests failed"
  exit 1
fi
echo "All tests passed!" 