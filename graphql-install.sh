#!/bin/bash

docker-compose up -d
# docker-compose exec postgres bash -c "cd /code; pg_restore -U postgres -d postgres vizee.dump; exit"
sleep 2
(
    cd hasura
    # hasura migrate create init --sql-from-server --endpoint https://hasura-staging.vizee.live
    hasura migrate apply --admin-secret=secret && hasura metadata apply --admin-secret=secret

)
