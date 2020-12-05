let config = {
  dev: {
    graphql: 'https://staging-graphql.vizee.live/v1/graphql',
    api: 'http://localhost:3001',
    ui: 'http://localhost:3000'
  },
  staging: {
    graphql: 'https://staging-graphql.vizee.live/v1/graphql',
    api: 'https://staging-api.vizee.live',
    ui: 'https://staging.vizee.live'
  },
  production: {
    graphql: 'https://graphql.vizee.live/v1/graphql',
    api: 'https://api.vizee.live',
    ui: 'https://www.vizee.live'
  }
};

let res;

if (
  window.location.href.includes('staging') ||
  window.location.href.includes('dev.vizee.live') ||
  window.location.href.includes('netlify')
) {
  res = config.staging;
} else if (window.location.href.includes('localhost')) {
  res = config.dev;
} else {
  res = config.production;
}

export default res;
