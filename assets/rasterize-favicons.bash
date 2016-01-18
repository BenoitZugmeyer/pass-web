#!/bin/bash
# Didn't find a proper rasterize loader for webpack (that doesn't use phantomjs), so I'll just put
# this here.

set -euo pipefail

cd $(dirname "$0")/..

rasterize () {
  local input="assets/$1"
  local output="public/$2"
  inkscape -w 32 -h 32 -e "$output" "$input"
  pngquant -f -o "$output" "$output"
}

rasterize lock.svg favicon.png
rasterize unlock.svg favicon-unlocked.png
