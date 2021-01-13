#!/bin/bash

yarn build
cp _redirects build/
cp _headers build/
echo $COMMIT_REF >> build/version.txt
