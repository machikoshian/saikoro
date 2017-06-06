#!/bin/sh

# Client side (web browser)
echo "Building standalone client"
webpack --config webpack.config.standalone.js || exit
cp ./src/saikoro.html ./docs/index.html

echo "open ./docs/index.html"
open ./docs/index.html
