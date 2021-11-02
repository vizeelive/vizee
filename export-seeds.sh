#!/bin/bash
set -euf -o pipefail

cd hasura
find seeds -type f -exec rm {} \;
hasura seeds create accounts --from-table accounts --admin-secret=secret
hasura seeds create accounts_users --from-table accounts_users --admin-secret=secret
hasura seeds create categories --from-table categories --admin-secret=secret
hasura seeds create events --from-table events --admin-secret=secret
hasura seeds create events_playlists --from-table events_playlists --admin-secret=secret
hasura seeds create events_tags --from-table events_tags --admin-secret=secret
hasura seeds create playlists --from-table playlists --admin-secret=secret
hasura seeds create products --from-table products --admin-secret=secret
hasura seeds create tags --from-table tags --admin-secret=secret
hasura seeds create users --from-table users --admin-secret=secret
hasura seeds create users_access --from-table users_access --admin-secret=secret
cd ../
