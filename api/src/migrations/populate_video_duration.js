require('dotenv').config({ path: '../../.env' });
const execute = require('../execute');
const { getVideoDurationInSeconds } = require('get-video-duration');
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
        const videoDuration = await getVideoDurationInSeconds(event.video);
        console.log(`${event.id} ${videoDuration}`);
        const UPDATE_VIDEO_DURATION = `
          mutation updateVideoDuration($id: uuid!, $duration: Int!) {
            update_events(where: {id: {_eq: $id}}, _set: {duration: $duration}) {
              affected_rows
            }
          }
      `;
        const { data, errors } = await execute(UPDATE_VIDEO_DURATION, {
          id: event.id,
          duration: parseInt(videoDuration)
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
