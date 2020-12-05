#!/bin/bash

# ./build.sh deadmau5
export REACT_APP_ACCOUNT=$1

yarn build
cp _redirects build/
