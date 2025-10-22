#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/${1}"
npx tsx "$SCRIPT_DIR/index.ts"