
![](https://dam-media.s3.amazonaws.com/vizee.png)

# Vizee.live

An video monetization and social networking platform for artists and creators.
## Setup

This monorepo contains a few things:

* `/api` (Node.js API)
* `/express` (Prerender.io) (currently replaced by Netlify)
* `/hasura` (Hasura metadata)
* `/src/` (React UI)

## GraphQL Documentation

You can find the schema at:

* `https://graphql.vizee.live/v1/graphql`
* `https://staging-graphql.vizee.live/v1/graphql`

GraphQL Playground is excellent.

![](https://dam-media.s3.amazonaws.com/graphql-playground.png)

So is Apollo Studio.

![](https://dam-media.s3.amazonaws.com/apollo-studio.png)

## UI Development

* `cd ui`
* `yarn`
* `yarn start`

If you want to test Stripe flows, you'll need to turn on the development API.

* `cd api; npm i; npm start`

## API Development

* `cd api`
* `npm i`
* `npm start`

## GraphQL Development

TBD
