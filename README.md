
![](https://dam-media.s3.amazonaws.com/vizee.png)

# Vizee.live

An video monetization and social networking platform for artists and creators.
## Setup

This monorepo contains a few things:

* `/api` (Node.js API)
* `/express` (Prerender.io) (currently replaced by Netlify prerender)
* `/hasura` (Hasura metadata)
* `/src/` (React UI)

## UI Development

* `yarn`
* `yarn start`

If you want to test Stripe flows, you'll need to turn on the development API.

* `npm run api`

## GraphQL/Hasura Development

### Setting Up Hasura

#### Requirements

* [Docker](https://docs.docker.com/get-docker/)
* docker-compose
* [hasura CLI](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html)

#### Installation

* `./graphql-install.sh`

### Loading Hasura Console

* `npm run graphql`

## API/Hasura Actions Development

* `npm run api`

## GraphQL Documentation

You can find the schema at:

* `https://graphql.vizee.live/v1/graphql`
* `https://staging-graphql.vizee.live/v1/graphql`

GraphQL Playground is excellent.

![](https://dam-media.s3.amazonaws.com/graphql-playground.png)

So is Apollo Studio.

![](https://dam-media.s3.amazonaws.com/apollo-studio.png)