#!/usr/bin/env bash

npm run test
npm run uglify

./node_modules/jsdoc/jsdoc.js ./src/ -d ../worker-docs

git pull
git add -A
git commit -m$1
git push