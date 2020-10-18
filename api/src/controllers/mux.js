const app = require('../app');
const { client } = require('../setup');
const { gql } = require('@apollo/client');
const bodyParser = require('body-parser');

const Mux = require('@mux/mux-node');
const { Video } = new Mux();

app.post(
  '/mux/webhook',
  bodyParser.json({ type: 'application/json' }),
  async function (req, res) {
    let data = req.body;
    console.log('body', req.body);

    let status;
    if (data.type === 'video.live_stream.active') {
      status = 'live';
    }

    if (data.type === 'video.live_stream.idle') {
      status = 'idle';
    }

    if (!status) {
      return res.send('OK');
    }

    try {
      await client.mutate({
        variables: {
          mux_id: data.object.id,
          status: status,
          data: data
        },
        mutation: gql`
          mutation UpdateMuxLivestream(
            $mux_id: String
            $status: String
            $data: jsonb
          ) {
            update_events(
              where: { mux_id: { _eq: $mux_id } }
              _set: { mux_livestream: $data, status: $status }
            ) {
              returning {
                id
              }
            }
          }
        `
      });
    } catch (e) {
      console.error(e);
    }

    res.send('OK');
  }
);

app.get('/mux/stream/create', async function (req, res) {
  let id = req.query.id;

  // TODO super insecure
  let result = await Video.LiveStreams.create({
    playback_policy: 'public',
    new_asset_settings: { playback_policy: 'public' }
  });

  console.log({ result });

  try {
    await client.mutate({
      variables: {
        id,
        mux_id: result.id,
        data: result
      },
      mutation: gql`
        mutation UpdateMuxLivestream(
          $id: uuid!
          $mux_id: String
          $data: jsonb!
        ) {
          update_events_by_pk(
            pk_columns: { id: $id }
            _set: { mux_id: $mux_id, mux_livestream: $data }
          ) {
            id
          }
        }
      `
    });
  } catch (e) {
    console.error(e);
  }

  res.json(result);
});
