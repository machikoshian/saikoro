#!/bin/sh

cd src

# Client side (web browser)
tsc --outDir ../out/client --module amd --project ./
cp -r third_party ../out/client
cp saikoro.html ../out/client

# Server side (Node.js)
tsc --outDir ../out/server --module commonjs --project ./
