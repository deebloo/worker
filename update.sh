#!/usr/bin/env bash

echo "########## create the documents"
npm run docs

echo "########## running unit tests"
npm run test

echo "########## uglify the code"
npm run uglify
cp ./src/web-worker.js dist

if [ "$2" ]
then
  echo "########## increment the release and push the tag to the repo"
  node ./build/up-version.js $2
  git tag -a "$(node ./build/get-version.js)" -m "$1"
  git push origin master --tags
fi

echo "########## commit and push the code up to the repo"
git pull
git add -A
git commit -m"$1"
git push

cd ..
git clone https://github.com/deebloo/worker.git worker-docs
cd worker-docs
git checkout gh-pages

cd ..
cd worker
cp -R ./docs. ../worker-docs/

cd ..
cd worker-docs
git add -A
git commit -m'update gh-pages doc'
git push

cd ..
rm -rf worker-docs