#!/bin/bash
set -euf -o pipefail

git checkout master
git merge dev
git push
git checkout dev
