#!/bin/sh

# Client side (web browser)
echo "Building standalone client"
webpack --config webpack.config.standalone.js || exit
cp ./src/saikoro.html ./out/standalone/index.html
cp ./src/icon.png ./out/standalone/icon.png

echo "open ./out/standalone/index.html"
open ./out/standalone/index.html
