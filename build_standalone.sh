#!/bin/sh

CLIENT_DIR=./out/standalone

# Client side (web browser)
echo "Building standalone client"
webpack --config webpack.config.standalone.js || exit
cp ./src/saikoro.html $CLIENT_DIR/index.html
cp ./src/saikoro.css $CLIENT_DIR/
cp ./src/icon.png $CLIENT_DIR/

if [ "$1" != "build" ]; then
    echo "open ${CLIENT_DIR}/index.html"
    open $CLIENT_DIR/index.html
fi;
