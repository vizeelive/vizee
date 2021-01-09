const Mux = require('@mux/mux-node');
const { Video } = new Mux();

function createToken(id) {
  return Mux.JWT.sign(id, {
    params: { time: 1 }
  });
}

function createPlaybackId(id) {
  return Video.Assets.createPlaybackId(id, {
    policy: 'signed'
  });
}

function createStream() {
  return Video.LiveStreams.create({
    playback_policy: 'signed',
    new_asset_settings: { playback_policy: 'signed' }
  });
}

module.exports = { createStream, createToken, createPlaybackId };
