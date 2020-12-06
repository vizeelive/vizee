const app = require('../app');
const { client } = require('../setup');
const { gql } = require('@apollo/client');
const bodyParser = require('body-parser');
// const formidable = require('formidable')

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

//   const respond = (res, code, messages) => {
//   if (code !== 200) {
//     console.error({ messages, code })
//   }

//   res.writeHead(code, {
//     'Content-Type'                : 'application/json',
//     'Access-Control-Allow-Origin' : '*',
//     'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
//   })

//   if (messages) {
//     res.write(JSON.stringify({ messages }))
//   }

//   res.end()
// }

//   const form = new formidable.IncomingForm()
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         return respond(res, 500, [`Error while parsing multipart form`, err])
//       }

//       // if (!checkSignature(fields, process.env.AUTH_SECRET)) {
//       //   return respond(res, 403, [
//       //     `Error while checking signatures`,
//       //     `No match so payload was tampered with, or an invalid Auth Secret was used`,
//       //   ])
//       // }

//       let assembly = {}
//       try {
//         assembly = JSON.parse(fields.transloadit)
//         var url = assembly.results[':original'][0].ssl_url);
//       } catch (err) {
//         return respond(res, 500, [`Error while parsing transloadit field`, err])
//       }
//     });


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

  // TODO @security super insecure
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
