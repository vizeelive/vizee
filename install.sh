#!/bin/bash

aws ssm get-parameter --region us-east-1 --name /platform/dev/env --with-decryption --output text --query Parameter.Value > api/.env
./graphql-install.sh
concurrently "yarn && (cd api; npm i)";