let config = {
  dev: {
    ws: 'ws://localhost:8080/v1/graphql',
    graphql: 'http://localhost:8080/v1/graphql',
    api: 'http://localhost:3001',
    ui: 'http://localhost:3000'
  },
  staging: {
    ws: 'wss://hasura-staging.vizee.live/v1/graphql',
    graphql: 'https://hasura-staging.vizee.live/v1/graphql',
    api: 'https://api-staging.vizee.live',
    ui: 'https://staging.vizee.live'
  },
  production: {
    ws: 'wss://hasura.vizee.live/v1/graphql',
    graphql: 'https://hasura.vizee.live/v1/graphql',
    api: 'https://api2.vizee.live',
    ui: 'https://www.vizee.live'
  }
};

let res;

if (window.location.href.includes('local')) {
  res = config.dev;
} else if (window.location.href.includes('staging')) {
  res = config.staging;
} else if (window.location.href.includes('netlify')) {
  res = config.staging;
} else {
  res = config.production;
}

if (window.Cypress) {
  res.ws = 'wss://hasura-staging.vizee.live/v1/graphql';
}

console.log(res);
export default res;
