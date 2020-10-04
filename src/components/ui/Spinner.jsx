import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

const Svg = styled.svg.attrs({
  viewBox: '0 0 50 50'
})`
  animation: ${rotate} 2s linear infinite;
  width: ${({ size }) => `${size}rem`};
  height: ${({ size }) => `${size}rem`};
  opacity: 0.75;
  will-change: transform;
  
  circle {
    stroke: ${({ theme: { colors } }) => colors.black};
    stroke-linecap: round;
    animation: ${dash} 1300ms ease-in-out infinite;
    will-change: stroke-dasharray, stroke-dashoffset;
  }
`;

function Spinner(props) {
  return (
    <Svg size={props.size}>
      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="2" />
    </Svg>
  )
}

Spinner.propTypes = {
  size: PropTypes.number
}

Spinner.defaultProps = {
  size: 5
}

export default Spinner

