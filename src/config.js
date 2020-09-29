let config = {
  dev: {
    graphql: 'https://cool-teal-29.hasura.app/v1/graphql',
    api: "http://localhost:3001",
  },
  staging: {
    graphql: 'https://cool-teal-29.hasura.app/v1/graphql',
    api: "https://muse-api.onrender.com",
  },
  production: {
    graphql: 'https://sterling-swan-51.hasura.app/v1/graphql',
    api: "https://muse-api.onrender.com",
  },
};

let res;

if (window.location.href.includes('staging')) {
  res = config.staging;
} else if (window.location.href.includes('localhost')) {
  res = config.staging;
} else {
  res = config.production;
}

export default res;
