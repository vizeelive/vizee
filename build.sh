#!/bin/bash

# ./build.sh deadmau5

export REACT_APP_ACCOUNT=$1

if [ "$1" -eq "vizee"]; then
  export REACT_APP_NETWORK=true
else
  export REACT_APP_NETWORK=false
fi

yarn build
cp _redirects build/
