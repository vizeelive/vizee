
![](https://dam-media.s3.amazonaws.com/vizee.png)

# Vizee.live

An video monetization and social networking platform for artists and creators.
## Setup

This monorepo contains a few things:

* `/api` (Node.js API)
* `/express` (Prerender.io) (currently replaced by Netlify prerender)
* `/hasura` (Hasura metadata)
* `/src/` (React UI)

## Infrastructure

* Netlify (UI)
* Render.com (API)
* AWS ECS via Copilot (Hasura GraphQL)
* AWS RDS (Postgres)
* Google Domains (DNS)
* GitHub (code)
* TransloadIt (file uploads)
* LogRocket (session recording)
* Auth0 (authentication)
* Mux (video transcoding)
* Sentry (bug tracking)
* Cypress (testing)

## UI Development

* `yarn`
* `yarn start`


## GraphQL/Hasura/Fullstack Development


#### Requirements

* [Docker](https://docs.docker.com/get-docker/)
* docker-compose
* [hasura CLI](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html)

#### Installation

* `./graphql-install.sh`

#### Starting Hasura, Express, and React

* `npm run stack`

## Pipeline

* Open a PR, view branch deployment on Netlify via link in PR
* Once merged to `dev` is depoys to `staging.pixwel.com`

## GraphQL Documentation

You can find the schema at:

* `https://graphql.vizee.live/v1/graphql`
* `https://staging-graphql.vizee.live/v1/graphql`

GraphQL Playground is excellent.

![](https://dam-media.s3.amazonaws.com/graphql-playground.png)

So is Apollo Studio.

![](https://dam-media.s3.amazonaws.com/apollo-studio.png)