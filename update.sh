#!/usr/bin/env bash

npm run docs
npm run test
npm run uglify

if [ "$2" ]
then
    node ./build/up-version.js $2
    git tag -a "$(node ./build/get-version.js)" -m "$1"
    git push origin master --tags
fi

git pull
git add -A
git commit -m"$1"
git push