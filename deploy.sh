#!/bin/bash
set -euf -o pipefail

npm run cypress:test
git stash
git push
git checkout master
git merge dev
git push
git checkout dev
git stash pop
