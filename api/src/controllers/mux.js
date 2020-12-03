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
    let mux_id;

    if (data.type === 'video.live_stream.active') {
      status = 'live';
      mux_id = data.object.id;
    }

    if (data.type === 'video.asset.live_stream_completed') {
      status = 'completed';
      mux_id = data.data.live_stream_id;
    }

    if (!status) {
      return res.send('OK');
    }

    try {
      await client.mutate({
        variables: {
          mux_id,
          status,
          data: data.data
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
      console.log(e);
    }

    res.send('OK');
  }
);

app.get('/mux/asset/create', async function (req, res) {
  let url = req.query.url;
  try {
    const asset = await Video.Assets.create({
      input: url
    });
    console.log({ asset });
    await client.mutate({
      variables: {
        url,
        mux_asset_id: asset.id
      },
      mutation: gql`
        mutation UpdateMuxId($url: String!, $mux_asset_id: String!) {
          update_events(
            where: { video: { _eq: $url } }
            _set: { mux_asset_id: $mux_asset_id }
          ) {
            affected_rows
          }
        }
      `
    });
    res.send('OK');
  } catch (e) {
    console.log(url, e);
    res.status(500).send(e.message);
  }
});

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
