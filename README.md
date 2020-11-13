# vizee

An video monetization platform for artists and creators.

## Setup

This monorepo contains a few things:

* `/api` (Node.js API)
* `/express` (Prerender.io)
* `/hasura` (Hasura metadata)
* `/src/` (React UI)

## UI Development

* `yarn`
* `yarn start`

If you want to test Stripe flows, you'll need to turn on the development API.

* `cd api; npm i; npm start`

## GraphQL Documentation

You can find the schema at: `https://graphql.vizee.live/v1/graphql`

GraphQL Playground is excellent.

![](https://dam-media.s3.amazonaws.com/graphql-playground.png)
