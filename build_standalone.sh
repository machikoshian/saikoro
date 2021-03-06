#!/bin/sh

CLIENT_DIR=./out/standalone

# Client side (web browser)
echo "Building standalone client"
webpack --config webpack.config.standalone.js || exit
./src/replace_keywords.sh ./src/saikoro.html > $CLIENT_DIR/index.html
sass ./src/saikoro.scss $CLIENT_DIR/saikoro.css
cp ./src/icon.png $CLIENT_DIR/

if [ "$1" != "build" ]; then
    echo "open ${CLIENT_DIR}/index.html"
    open $CLIENT_DIR/index.html
fi;
