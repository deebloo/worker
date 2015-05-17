#!/usr/bin/env bash

Message=$1

npm run docs
npm run test
npm run uglify

if [ "$2" ]
then
node ./build/upversion.js $2
fi

echo "$Message"

git pull
git add -A
git commit -m"$Message"
git push