import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import styled from 'styled-components';

// import { WaveformContianer, Wave, PlayButton } from './Waveform.styled';

const WaveformContianer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  background: transparent;
`;

const Wave = styled.div`
  width: 100%;
  height: 90px;
`;

const PlayButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 60px;
  background: #262626;
  border-radius: 10%;
  border: none;
  outline: none;
  cursor: pointer;
  padding-bottom: 3px;
  margin-right: 10px;
`;

class Waveform extends Component {
  state = {
    playing: false
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.waveform = WaveSurfer.create({
      barWidth: 3,
      cursorWidth: 1,
      container: this.ref.current,
      backend: 'WebAudio',
      height: 80,
      progressColor: '#ee326e',
      responsive: true,
      waveColor: '#ee326e'
    });

    this.waveform.load(this.props.url);
  }

  componentWillUnmount() {
    this.waveform.destroy();
  }

  handlePlay = (e) => {
    e.preventDefault();
    this.setState({ playing: !this.state.playing });
    this.waveform.playPause();
  };

  render() {
    return (
      <WaveformContianer>
        <PlayButton onClick={this.handlePlay}>
          {!this.state.playing ? 'Play' : 'Pause'}
        </PlayButton>
        <Wave id="waveform" ref={this.ref} />
      </WaveformContianer>
    );
  }
}

export default Waveform;
