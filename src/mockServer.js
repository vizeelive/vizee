import { rest, setupWorker } from 'msw';
import { gql } from '@apollo/client';
import { buildClientSchema, execute } from 'graphql';
import { addMocksToSchema } from '@graphql-tools/mock';

import introspection from './schema.json';
const schema = buildClientSchema(introspection);

let mocks = {
  Int: () => 6,
  Float: () => 22.1,
  String: () => 'Lorem ipsum',
  uuid: () => 'cc54e7a2-e398-4eda-9807-877bf3536dbb',
  timestamptz: () => '2020-01-01T00:00:00.000Z',
  point: () => '(-87.443902,20.1852328)',
  bigint: () => 123456789,
  money: () => '$9.99',
  numeric: () => '123',
  date: () => '2021-01-01',
  jsonb: () => {
    hello: 'world';
  },
  accounts: () => {
    return {
      name: 'Cosmic Awakenings',
      username: 'cosmic',
      instagram: 'cosmicawakenings',
      facebook: 'cosmicawakenings',
      twitter: 'cosmicawakenings',
      stripe_data: '{}',
      preview:
        'https://vizee-media.s3.amazonaws.com/ec/006381886e45e88659506b9cc8d72d/Vizee-16x9-Noise-Reduction-Lemurian_at_Ibiza.mp4',
      photo:
        'https://vizee-media.s3.amazonaws.com/45/5ba51405ae49399baa4e13e5d0901a/076_Fletcher-Monsoon-Vizee-Cover.jpeg'
    };
  },
  events: () => {
    return {
      name: 'My Cool Event',
      preview:
        'https://vizee-media.s3.amazonaws.com/ec/006381886e45e88659506b9cc8d72d/Vizee-16x9-Noise-Reduction-Lemurian_at_Ibiza.mp4',
      thumb:
        'https://vizee-media.s3.amazonaws.com/92/7faa9720454643b0460cd0c8b0728b/Bart-Skils---Dub-Killer-Drumcode.jpg'
    };
  },
  subscriptions: () => {
    return {
      status: 'active'
    };
  },
  events_report: () => {
    return {
      account_only: false
    };
  }
};

let started = false;
var worker = setupWorker();

async function start() {
  let res = await worker.start();
  started = true;
  return res;
}

function init({ mocks }) {
  if (window.Cypress && !started) {
    start();
  }
  const mockedSchema = addMocksToSchema({
    schema,
    mocks,
    preserveResolvers: true
  });

  worker.resetHandlers();
  worker.use(
    rest.get('https://ipinfo.io*', (req, res) => {
      return res(
        ctx.json({
          ip: '45.17.98.35',
          hostname: '45-17-98-35.lightspeed.moblal.sbcglobal.net',
          city: 'Mobile',
          region: 'Alabama',
          country: 'US',
          loc: '30.6944,-88.0430',
          org: 'AS7018 AT&T Services, Inc.',
          postal: '36601',
          timezone: 'America/Chicago'
        })
      );
    }),
    rest.get('http://localhost:3001/cookie'),
    rest.post('https://*.litix.io/', (req, res) => {}),
    rest.post('http://localhost:8080/v1/graphql', async (req, res, ctx) => {
      const result = await execute(
        mockedSchema,
        gql`
          ${req.body.query}
        `,
        null,
        null,
        req.body.variables
      );
      return res(ctx.json(result));
    })
  );
  window.msw = worker;
}

function intercept(newMocks) {
  let updatedMocks = mocks;
  for (let k in newMocks) {
    let merged = Object.assign(mocks[k](), newMocks[k]);
    updatedMocks[k] = () => Object.assign({}, merged);
  }
  return init({ mocks: updatedMocks });
}

if (process.env.REACT_APP_MOCK === 'true') {
  start();
}

init({ mocks });

window.mockServer = { intercept };
