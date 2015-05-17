#!/usr/bin/env bash

npm run docs
npm run test
npm run uglify

if [ "$2" ]
then
node ./build/upversion.js $2
fi

git pull
git add -A
git commit -m"$1"
git push