#!/usr/bin/env bash

set -euo pipefail

cd $(dirname $0)

npx babel-node Counter.js
