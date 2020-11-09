import React from 'react';
import videojs from 'video.js';
import 'videojs-mux';
import 'video.js/dist/video-js.min.css';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #111;
`;

const VideoContainer = styled.div`
  max-width: 60rem;
  margin: 0 auto;
`;

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    // instantiate Video.js
    var playerInitTime = Date.now();
    let options = Object.assign(
      {
        plugins: {
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
    this.player = videojs(this.videoNode, options, function onPlayerReady() {
      // console.log('onPlayerReady', this);
    });
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
    return (
      <Container>
        <VideoContainer>
          <div data-vjs-player>
            <video
              ref={(node) => (this.videoNode = node)}
              className="video-js"
            ></video>
          </div>
        </VideoContainer>
      </Container>
    );
  }
}
