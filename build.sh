#!/bin/sh

cd src
tsc --outDir ../out --sourceMap --module amd saikoro.ts
cp -r third_party ../out
cp saikoro.html ../out
