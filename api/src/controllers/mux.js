const app = require('../app');
const { client } = require('../setup');
const { gql } = require('@apollo/client');

const Mux = require('@mux/mux-node');
const { Video } = new Mux();

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
