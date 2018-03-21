#!/usr/bin/env bash
set -e
for i in $(eval echo {$1..$2})
do
  node --max-old-space-size=2048 dist/runner.js $i $i
done
