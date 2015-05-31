#!/usr/bin/env bash
echo "########## copy docs to gh-pages branch and push"
npm run docs
cd ..
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