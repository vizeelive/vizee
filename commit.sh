#!/bin/bash

if [ -z "$1" ]
  then
    echo "Missing commit message"
    exit
fi

set -euf -o pipefail
MSG=$1

git add .
git commit -m "$1"
git push
git checkout master
git merge dev
git push
git checkout dev
