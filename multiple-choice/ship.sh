#!/usr/bin/env bash

set -euxo pipefail

yarn test

git push
