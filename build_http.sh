#!/bin/sh

# Client side (web browser)
echo "Building http client"
webpack --config webpack.config.http.js || exit
cp ./src/saikoro.html ./out/client/
cp ./src/icon.png ./out/client/icon.png

# Server side (Node.js)
echo "Building server"
tsc --outDir ./out/server --module commonjs --target es6 --sourceMap src/server.ts || exit
cp ./serviceAccountKey.json ./out/server

if [ "$1" != "build" ] {
    echo "open http://localhost:3156/saikoro.html"
    DEBUG=1 node out/server/server.js
}
