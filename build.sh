#!/bin/sh

cd src

# Client side (web browser)
tsc --outDir ../out/client --sourceMap --module amd saikoro.ts
cp -r third_party ../out/client
cp saikoro.html ../out/client

# Server side (Node.js)
tsc --outDir ../out/server --sourceMap --module commonjs server.ts
