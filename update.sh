#!/usr/bin/env bash

################
# Run Unit Tests
################
echo "########## running unit tests"
npm run test

#############
# Uglify Code
#############
echo "########## uglify the code"
npm run uglify
cp ./src/web-worker.js dist

#########################################################
# If a second argument is passed in. (major|minor|patch))
#########################################################
if [ "$2" ]
then
    ###########################################
    # Increment the version and tag for release
    ###########################################
    echo "########## increment the release and push the tag to the repo"
    node ./build/up-version.js $2
    git tag -a "$(node ./build/get-version.js)" -m "$1"
    git push origin master --tags

    ########################################
    # Update the docs to the gh-pages branch
    ########################################
    echo "########## create the documents"
    npm run docs
    cd ..
    git clone https://github.com/deebloo/worker.git worker-docs
    cd worker-docs
    git checkout gh-pages
    rm -rf *
    cd ..
    cd worker
    cp -R "./docs/". "../worker-docs/"
    cd ..
    cd worker-docs
    git add -A
    git commit -m"update gh-pages doc"
    git push
    cd ..
    rm -rf worker-docs
fi

######################################
# Commit and push the code to the repo
######################################
echo "########## commit and push the code up to the repo"
git pull
git add -A
git commit -m"$1"
git push