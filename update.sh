#!/usr/bin/env bash

npm run docs
npm run test
npm run uglify

node ./build/upversion.js m$1

git pull
git add -A
git commit -m$2
git push