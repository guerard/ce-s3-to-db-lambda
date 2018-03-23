#!/usr/bin/env bash
set -e
node --max-old-space-size=2048 dist/runner.js $1 $2
