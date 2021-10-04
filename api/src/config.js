let config = {
  dev: {
    //api: 'https://hasura-staging.vizee.live/v1/graphql',
    api: 'https://hasura-staging.vizee.live/v1/graphql',
    ui: 'https://dev.vizee.live:3000'
  },
  test: {
    api: 'https://hasura-staging.vizee.live/v1/graphql',
    ui: 'https://localhost:3000'
  },
  staging: {
    api: 'https://hasura-staging.vizee.live/v1/graphql',
    ui: 'https://staging.vizee.live'
  },
  production: {
    api: 'https://hasura.vizee.live/v1/graphql',
    ui: 'https://www.vizee.live'
  }
};

let env = process.env.NODE_ENV || 'dev';
console.log(env);

module.exports = config[env];
