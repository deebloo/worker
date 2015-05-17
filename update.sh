#!/usr/bin/env bash

Message=$1

npm run docs
npm run test
npm run uglify

if [ "$1" =  "major" ] || [ "$1" =  "minor" ] || [ "$1" =  "patch" ]
then
node ./build/upversion.js $1
Message=$2
fi

echo "$Message"

git pull
git add -A
git commit -m"$Message"
git push