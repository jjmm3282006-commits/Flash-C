#!/bin/bash
# Quick start script for Termux

echo "Starting Flashcard Maker server..."
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Python not found. Installing..."
    pkg install python -y
fi

# Start the server
python server.py
