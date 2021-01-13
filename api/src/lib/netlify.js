const config = require('../config');
const logger = require('../logger');
const fetch = require('node-fetch');

const createSite = async (data) => {
  const { username } = data;
  const fetchResponse = await fetch('https://api.netlify.com/api/v1/sites', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      name: `vizee-${username}`,
      account_slug: 'vizee',
      prerender: 'true',
      custom_domain: `${username}.vizee.pro`,
      repo: {
        provider: 'github',
        installation_id: 9892755,
        id: 299687238,
        repo: 'phishy/vizee',
        private: true,
        branch: 'master',
        cmd: `./build.sh ${username}`,
        dir: 'build/'
      },
      default_hooks_data: {}
    })
  });
  let res = await fetchResponse.json();
  if (res.errors) {
    logger.info('netlify::createSite', res.errors);
  }
  return res;
};

module.exports = { createSite };
