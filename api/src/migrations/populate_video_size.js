require('dotenv').config({ path: '../../.env' });
const execute = require('../execute');
const fetch = require('node-fetch');
const Promise = require('bluebird');

const GET_VIDEO_URLS = `
query getVideoUrls {
  events(limit: 5000) {
    id
    video
  }
}
`;

async function main() {
  const { data, errors } = await execute(GET_VIDEO_URLS, null, {
    'x-hasura-role': 'admin'
  });

  if (errors) {
    console.log(errors);
    process.exit(1);
  }

  await Promise.map(
    data.events,
    async (event) => {
      if (!event.video) {
        return;
      }
      try {
        console.log(event.video);
        const size = await fetch(event.video, {
          method: 'HEAD'
        }).then((res) => res.headers.get('Content-Length'));
        console.log(`${event.id} ${size}`);
        const UPDATE_VIDEO_SIZE = `
          mutation updateVideoDuration($id: uuid!, $size: bigint!) {
            update_events(where: {id: {_eq: $id}}, _set: {size: $size}) {
              affected_rows
            }
          }
      `;
        const { data, errors } = await execute(UPDATE_VIDEO_SIZE, {
          id: event.id,
          size
        });
        if (errors) {
          console.log(errors);
        }
        console.log({ data });
      } catch (e) {
        console.log(e.message);
      }
    },
    { concurrency: 10 }
  );
}

main();
