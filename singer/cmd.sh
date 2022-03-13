#!/bin/bash

set -xeuf -o pipefail

if [ -z "$1" ]; then
  $1 = 'null';
fi

if [ "$1" = "-single" ]; then
    /usr/local/bin/tap-stripe -c /config/stripe-config.json --catalog /code/catalog.json --state /config/state.json | /usr/local/bin/target-postgres -c /config/postgres-config.json >>/config/state.json
    tail -1 /config/state.json >/config/state.json.tmp
    mv /config/state.json.tmp /config/state.json
    exit 0
fi

while true; do
  /usr/local/bin/tap-stripe -c /config/stripe-config.json --catalog /code/catalog.json --state /config/state.json | /usr/local/bin/target-postgres -c /config/postgres-config.json >>/config/state.json
  tail -1 /config/state.json >/config/state.json.tmp
  mv /config/state.json.tmp /config/state.json
done