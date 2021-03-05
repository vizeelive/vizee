#!/bin/bash

docker-compose up -d
docker-compose exec postgres bash -c "cd /code; pg_restore -U postgres -d postgres vizee.dump; exit"
sleep 2
(
    cd hasura
    hasura metadata apply --endpoint http://localhost:8080 --admin-secret=secret
)
npm run graphql
