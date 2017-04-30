#!/bin/sh

cd src

# Client side (web browser)
echo "Building client"
tsc --outDir ../out/client --module amd --project ./ || exit
cp -r third_party ../out/client
cp saikoro.html ../out/client

# Server side (Node.js)
echo "Building server"
tsc --outDir ../out/server --module commonjs --project ./ || exit

cd ..
echo "open http://localhost:3156/saikoro.html"
node out/server/server.js
