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

module.exports = { createToken, createPlaybackId };
