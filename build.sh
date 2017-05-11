#!/bin/sh

# Client side (web browser)
echo "Building client"
webpack || exit
cp ./src/saikoro.html ./out/client

cd src
# Server side (Node.js)
echo "Building server"
tsc --outDir ../out/server --module commonjs --project ./ || exit
cp ../serviceAccountKey.json ../out/server

cd ..
echo "open http://localhost:3156/saikoro.html"
DEBUG=1 node out/server/server.js
