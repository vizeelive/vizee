let config = {
  dev: {
    graphql: 'https://cool-teal-29.hasura.app/v1/graphql',
    api: 'http://localhost:3001',
    ui: 'http://localhost:3000'
  },
  staging: {
    graphql: 'https://cool-teal-29.hasura.app/v1/graphql',
    api: 'https://staging-api.vizee.live'
  },
  production: {
    graphql: 'https://sterling-swan-51.hasura.app/v1/graphql',
    api: 'https://api.vizee.live'
  }
};

let res;

if (window.location.href.includes('staging')) {
  res = config.staging;
} else if (window.location.href.includes('localhost')) {
  res = config.dev;
} else {
  res = config.production;
}

export default res;
