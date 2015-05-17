#!/usr/bin/env bash

npm run docs
npm run test
npm run uglify

if [ "$2" ]
then
    git pull
    node ./build/up-version.js $2
    git add -A
    git tag -a "$(node ./build/get-version.js)" -m "$1"
    git push origin master --tags
else
    git pull
    git add -A
    git commit -m"$1"
    git push
fi