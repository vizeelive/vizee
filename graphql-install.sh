#!/bin/bash
set -xeuf -o pipefail

# destroy existing installation
docker-compose down
docker volume rm vizee_db_data || true

docker-compose up -d postgres
sleep 10

npx wait-on tcp:5432 && docker-compose exec postgres bash -c "psql -U postgres -d postgres -c \"create schema stripe;\"; exit;"
zx install.js
docker-compose up singer-single
docker-compose stop singer-single
docker-compose up -d singer graphql-engine
sleep 10
(
    cd hasura
    npx hasura --skip-update-check migrate apply --admin-secret=secret
    npx hasura --skip-update-check metadata apply --admin-secret=secret
    npx hasura --skip-update-check seeds apply --admin-secret=secret
)
