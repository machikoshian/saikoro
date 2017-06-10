#!/bin/sh

CLIENT_DIR=./public
SERVER_DIR=./functions

# Firebase hosting
echo "Building firebase client"
webpack --config webpack.config.firebase.js || exit
./src/replace_keywords.sh ./src/saikoro.html > $CLIENT_DIR/index.html
cp ./src/saikoro.css $CLIENT_DIR/
cp ./src/icon.png $CLIENT_DIR/

# Firebase functions (Node.js)
echo "Building firebase functions"
tsc --outDir $SERVER_DIR --module commonjs --target es6 --sourceMap src/firebase_functions.ts || exit
cp ./serviceAccountKey.json $SERVER_DIR
cp $SERVER_DIR/firebase_functions.js  $SERVER_DIR/index.js
