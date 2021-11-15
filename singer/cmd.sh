#!/bin/bash

while true; do
    /usr/local/bin/tap-stripe -c /config/stripe-config.json --catalog /code/catalog.json --state /config/state.json | /usr/local/bin/target-postgres -c /config/postgres-config.json >>/config/state.json
    tail -1 /config/state.json >/config/state.json.tmp
    mv /config/state.json.tmp /config/state.json
    sleep 60
done
