#!/bin/bash

# Exit on error
set -e

# Install root dependencies
npm install

# Go to frontend directory and install dependencies
cd frontend
npm install --legacy-peer-deps

# Build the frontend
npm run build

# Go back to root directory
cd ..
