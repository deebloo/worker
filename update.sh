#!/usr/bin/env bash
##### TODO: move some of these things to CI

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

    ./gh-pages.sh
fi

echo "########## commit and push the code up to the repo"
git pull
git add -A
git commit -m"$1"
git push