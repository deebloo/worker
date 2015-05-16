#!/usr/bin/env bash

npm run docs
npm run test
npm run uglify
git pull
git add -A
git commit -m$1
git push