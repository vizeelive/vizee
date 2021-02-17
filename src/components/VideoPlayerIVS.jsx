import React from 'react';
import videojs from 'video.js';
import { registerIVSTech, registerIVSQualityPlugin } from 'amazon-ivs-player';
import 'videojs-mux';
import 'video.js/dist/video-js.min.css';

registerIVSTech(videojs, {
  wasmWorker: window.location.origin + '/amazon-ivs-wasmworker.min.js',
  wasmBinary: window.location.origin + '/amazon-ivs-wasmworker.min.wasm'
});

registerIVSQualityPlugin(videojs);

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    var playerInitTime = Date.now();
    let options = Object.assign(
      {
        techOrder: ['AmazonIVS'],
        plugins: {
          mux: {
            // debug: true,
            data: {
              env_key: process.env.REACT_APP_MUX_ENVIRONMENT,
              player_name: 'Vizee',
              player_init_time: playerInitTime
            }
          }
        }
      },
      this.props
    );
    this.player = videojs(this.videoNode, options, function onPlayerReady() {
      this.enableIVSQualityPlugin();
      this.src(options.sources[0].src);
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div>
        <div data-vjs-player>
          <video
            playsInline
            autoPlay
            ref={(node) => (this.videoNode = node)}
            className="video-js"
          />
        </div>
      </div>
    );
  }
}
