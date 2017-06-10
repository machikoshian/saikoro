#!/bin/sh

# Firebase hosting
echo "Building firebase client"
webpack --config webpack.config.firebase.js || exit
cp ./src/saikoro.html ./public/index.html
cp ./src/icon.png ./public/icon.png

# Firebase functions (Node.js)
echo "Building firebase functions"
tsc --outDir ./functions --module commonjs --target es6 --sourceMap src/firebase_functions.ts || exit
cp ./serviceAccountKey.json ./functions
cp ./functions/firebase_functions.js  ./functions/index.js
