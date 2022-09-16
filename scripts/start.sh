#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
SRC_DIR="$SCRIPT_DIR/.."

cd "$SCRIPT_DIR"
LOG_LEVEL=""
API_BACKEND=""
source .env.local

cd "$SRC_DIR"
npm run start