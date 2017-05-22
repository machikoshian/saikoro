#!/bin/sh

# Client side (web browser)
echo "Building http client"
webpack --config webpack.config.http.js || exit
cp ./src/saikoro.html ./out/client/

# Firebase hosting
echo "Building firebase client"
webpack --config webpack.config.firebase.js || exit
cp ./src/saikoro.html ./public/index.html

cd src
# Server side (Node.js)
echo "Building server"
tsc --outDir ../out/server --module commonjs --target es6 --sourceMap server.ts || exit
cp ../serviceAccountKey.json ../out/server

# Firebase functions (Node.js)
echo "Building firebase functions"
tsc --outDir ../functions --module commonjs --target es6 --sourceMap firebase_functions.ts || exit
cp ../serviceAccountKey.json ../functions
cp ../functions/firebase_functions.js  ../functions/index.js

cd ..
echo "open http://localhost:3156/saikoro.html"
DEBUG=1 node out/server/server.js
