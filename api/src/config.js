let config = {
  dev: {
    api: 'https://staging-graphql.vizee.live/v1/graphql',
    ui: 'https://dev.vizee.live:3000'
  },
  test: {
    api: 'https://staging-graphql.vizee.live/v1/graphql',
    ui: 'https://localhost:3000'
  },
  staging: {
    api: 'https://staging-graphql.vizee.live/v1/graphql',
    ui: 'https://staging.vizee.live'
  },
  production: {
    api: 'https://graphql.vizee.live/v1/graphql',
    ui: 'https://www.vizee.live'
  }
};

let env = process.env.NODE_ENV || 'dev';

module.exports = config[env];
