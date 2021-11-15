#!/bin/bash

CONFIG_DIR="${CONFIG_DIR:-/code}"
/usr/local/bin/tap-stripe -c /$CONFIG_DIR/stripe-config.json --catalog /code/catalog.json --state /$CONFIG_DIR/state.json | /usr/local/bin/target-postgres -c /$CONFIG_DIR/postgres-config.json >>/$CONFIG_DIR/state.json
tail -1 /$CONFIG_DIR/state.json >/$CONFIG_DIR/state.json.tmp
mv /$CONFIG_DIR/state.json.tmp /$CONFIG_DIR/state.json
