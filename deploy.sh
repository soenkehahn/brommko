#!/usr/bin/env bash

set -eux

yarn install
flow stop && flow
jest

rm -rf docs
mkdir -p docs
cp dist/index.html docs/

rm dist/main.js
webpack --content-base dist --mode production
cp dist/main.js docs/
