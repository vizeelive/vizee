const config = require('../config');
const logger = require('../logger');
const fetch = require('node-fetch');

// const createSite = async (data) => {
//   const { username } = data;
//   const fetchResponse = await fetch('https://api.netlify.com/api/v1/sites', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
//       'Content-Type': 'application/json',
//       Accept: 'application/json'
//     },
//     body: JSON.stringify({
//       name: `vizee-${username}`,
//       account_slug: 'vizee',
//       prerender: 'true',
//       custom_domain: `${username}.vizee.pro`,
//       repo: {
//         provider: 'github',
//         installation_id: 9892755,
//         id: 299687238,
//         repo: 'phishy/vizee',
//         private: true,
//         branch: 'master',
//         cmd: `./build.sh ${username}`,
//         dir: 'build/'
//       },
//       default_hooks_data: {}
//     })
//   });
//   let res = await fetchResponse.json();
//   if (res.errors) {
//     logger.info('netlify::createSite', res.errors);
//   }
//   return res;
// };

const getSite = async () => {
  try {
    let res = await fetch(
      'https://api.netlify.com/api/v1/sites/7c0f6ceb-5dde-4f50-b650-346c3a270258',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );
    var site = await res.json();
    if (site?.errors) {
      logger.error('netlify::addDomain', { errors: site.errors });
      throw new Error('unable to fetch netlify site');
    }
    return site;
  } catch (e) {
    logger.error('netlify::getSite failed');
    throw e;
  }
};

const updateSite = async (data) => {
  try {
    var res = await fetch(
      'https://api.netlify.com/api/v1/sites/7c0f6ceb-5dde-4f50-b650-346c3a270258',
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    var site = await res.json();
    if (site.errors) {
      logger.error('netlify::addDomain', { errors: site.errors });
      throw new Error('unable to patch netlify site');
    }
  } catch (e) {
    logger.error(`netlify::getSite ${e.message}`, { data });
    throw e;
  }
};

const removeDomain = async (data) => {
  const { username } = data;
  let site = await getSite();
  logger.debug('netlify::removeDomain - existing aliases', {
    domain_aliases: site.domain_aliases
  });
  let domain_aliases = site.domain_aliases.filter(
    (alias) => alias !== `${username}.vizee.pro`
  );
  logger.debug('domain aliases', domain_aliases);
  await updateSite({ domain_aliases });
  return true;
};

const addDomain = async (data) => {
  const { username } = data;
  let site = await getSite();
  let domain_aliases = site.domain_aliases;
  domain_aliases.push(`${username}.vizee.pro`);
  await updateSite({ domain_aliases });
  return true;
};

module.exports = { addDomain, removeDomain };
