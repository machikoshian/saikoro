#!/bin/sh

CLIENT_DIR=./out/client
SERVER_DIR=./out/server

# Client side (web browser)
echo "Building http client"
webpack --config webpack.config.http.js || exit
./src/replace_keywords.sh ./src/saikoro.html > $CLIENT_DIR/index.html
cp ./src/saikoro.css $CLIENT_DIR/
cp ./src/icon.png $CLIENT_DIR/

# Server side (Node.js)
echo "Building server"
tsc --outDir $SERVER_DIR --module commonjs --target es6 --sourceMap src/server.ts || exit
cp ./serviceAccountKey.json $SERVER_DIR

if [ "$1" != "build" ]; then
    echo "open http://localhost:3156/"
    DEBUG=1 node $SERVER_DIR/server.js
    open http://localhost:3156/
fi

