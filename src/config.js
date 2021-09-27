let config = {
  dev: {
    graphql: 'http://localhost:8080/v1/graphql',
    api: 'http://localhost:3001',
    ui: 'http://localhost:3000'
  },
  staging: {
    graphql: 'https://hasura-staging.vizee.live/v1/graphql',
    api: 'https://api-staging.vizee.live',
    ui: 'https://staging.vizee.live'
  },
  production: {
    graphql: 'https://hasura.vizee.live/v1/graphql',
    api: 'https://api.vizee.live',
    ui: 'https://www.vizee.live'
  }
};

let res;

if (window.location.href.includes('localhost')) {
  res = config.staging;
} else if (window.location.href.includes('staging')) {
  res = config.staging;
} else if (window.location.href.includes('netlify')) {
  res = config.staging;
} else if (window.location.href.includes('dev.vizee.live')) {
  res = config.dev;
} else {
  res = config.production;
}

console.log(res);
export default res;
