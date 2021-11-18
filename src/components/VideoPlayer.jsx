import React from 'react';
import videojs from 'video.js';
import qualityLevels from 'videojs-contrib-quality-levels';
import hlsQualitySelector from 'videojs-hls-quality-selector';
import { LockOutlined } from '@ant-design/icons';
import 'videojs-mux';
import 'video.js/dist/video-js.min.css';
import '@silvermine/videojs-airplay/dist/silvermine-videojs-airplay.css';

videojs.registerPlugin('qualityLevels', qualityLevels);
videojs.registerPlugin('hlsQualitySelector', hlsQualitySelector);
require('@silvermine/videojs-airplay')(videojs);

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    // instantiate Video.js
    var playerInitTime = Date.now();
    let options = Object.assign(
      {
        plugins: {
          airPlay: {
            addButtonToControlBar: true
          },
          mux: {
            // debug: true,
            data: {
              env_key: process.env.REACT_APP_MUX_ENVIRONMENT, // required

              // Metadata
              player_name: 'Vizee', // ex: 'My Main Player'
              player_init_time: playerInitTime // ex: 1451606400000

              // ... and other metadata
            }
          }
        }
      },
      this.props
    );
    let props = this.props;
    try {
      this.player = videojs(this.videoNode, options, function onPlayerReady() {
        let reloadOptions = {};
        reloadOptions.errorInterval = 5;
        this.reloadSourceOnError(reloadOptions);
        this.hlsQualitySelector({
          displayCurrentQuality: true
        });
        this.on('error', function (event) {
          var time = this.currentTime();

          if (this.error().code === 4) {
            this.error(null);
            this.pause();
            this.load();
            this.currentTime(time);
            this.play();
          }
        });
        this.on('ended', () => {
          if (props.onEnded) {
            props.onEnded();
          }
        });
        // console.log('onPlayerReady', this);
      });
    } catch (e) {}
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    let isDev = process.env.NODE_ENV === 'development' ? true : false;
    let preview = (
      <span className="absolute z-50 ml-2 mt-2 items-center px-2 py-0.5 rounded-sm text-sm font-semibold bg-gray-750 text-white uppercase">
        Preview
      </span>
    );

    let styles = this.props?.cover
      ? {
          backgroundImage: `url('${this.props.cover}')`,
          backgroundSize: 'cover'
        }
      : null;

    return (
      <div>
        {this.props?.preview && preview}
        {/* <div className="absolute z-50 bottom-10 left-2">
          <LockOutlined style={{ verticalAlign: 'text-bottom' }} /> Subscribe to
          unlock
        </div> */}
        <div data-vjs-player>
          <video
            style={styles}
            data-test-id={this.props?.['data-test-id']}
            muted={isDev}
            playsInline
            autoPlay={this.props?.autoplay || false}
            ref={(node) => (this.videoNode = node)}
            className="video-js vjs-big-play-centered"
          />
        </div>
      </div>
    );
  }
}
