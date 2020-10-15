let config = {
  dev: {
    api: 'https://cool-teal-29.hasura.app/v1/graphql',
    ui: 'http://localhost:3000'
  },
  staging: {
    api: 'https://cool-teal-29.hasura.app/v1/graphql',
    ui: 'https://staging.vizee.live'
  },
  production: {
    api: 'https://sterling-swan-51.hasura.app/v1/graphql',
    ui: 'https://www.vizee.live'
  }
};

let env = process.env.NODE_ENV || 'dev';

console.log('config', config[env]);

module.exports = config[env];
