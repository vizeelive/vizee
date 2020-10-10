let config = {
  dev: {
    api: "https://cool-teal-29.hasura.app/v1/graphql",
    ui: "http://localhost:3000",
  },
  staging: {
    api: "https://cool-teal-29.hasura.app/v1/graphql",
    ui: "https://muse-staging.onrender.com",
  },
  production: {
    api: "https://sterling-swan-51.hasura.app/v1/graphql",
    ui: "https://muse.onrender.com",
  },
};

let env = process.env.NODE_ENV || 'dev';

module.exports = config[env];
