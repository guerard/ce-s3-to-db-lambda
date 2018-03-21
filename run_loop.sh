#!/usr/bin/env bash
set -e
for i in $(eval echo {$1..$2})
do
  node --max-old-space-size=4096 dist/runner.js $i $i
done
