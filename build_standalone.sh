#!/bin/sh

# Client side (web browser)
echo "Building standalone client"
webpack --config webpack.config.standalone.js || exit
cp ./src/saikoro.html ./out/standalone/

echo "open ./out/standalone/saikoro.html"
open ./out/standalone/saikoro.html
