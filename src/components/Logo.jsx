import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

const Svg = styled.svg`
  width: ${({ size }) => `${size}rem`};
`;

function Logo(props) {
  const { size } = props;

  return (
    <Svg
      version="1.1"
      viewBox="0 0 128 109"
      xmlns="http://www.w3.org/2000/svg"
      size={size}
    >
      <defs>
        <linearGradient
          id="vizeeLogo_0"
          gradientUnits="userSpaceOnUse"
          x1="56.9757"
          y1="360.4434"
          x2="56.9757"
          y2="279.6892"
          gradientTransform="matrix(1 0 0 1 0 -278.6664)"
        >
          <stop offset="0" style={{ stopColor: '#183554'}} />
          <stop offset="1.519918e-03" style={{ stopColor: '#1B3655'}} />
          <stop offset="0.0423" style={{ stopColor: '#47395A'}} />
          <stop offset="0.0861" style={{ stopColor: '#673B5F'}} />
          <stop offset="0.1353" style={{ stopColor: '#833C63'}} />
          <stop offset="0.1889" style={{ stopColor: '#9D3B66'}} />
          <stop offset="0.248" style={{ stopColor: '#B43A68'}} />
          <stop offset="0.3148" style={{ stopColor: '#C7386A'}} />
          <stop offset="0.3928" style={{ stopColor: '#D6356B'}} />
          <stop offset="0.4892" style={{ stopColor: '#E2336D'}} />
          <stop offset="0.6245" style={{ stopColor: '#EB326E'}} />
          <stop offset="1" style={{ stopColor: '#EE326E'}} />
        </linearGradient>

        <linearGradient
          id="vizeeLogo_1"
          gradientUnits="userSpaceOnUse"
          x1="71.0243"
          y1="305.8895"
          x2="71.0243"
          y2="386.6437"
          gradientTransform="matrix(1 0 0 1 0 -278.6664)"
        >
          <stop offset="1.497918e-08" style={{ stopColor: '#183554'}} />
          <stop offset="0.0417" style={{ stopColor: '#453E5F'}} />
          <stop offset="0.0855" style={{ stopColor: '#654669'}} />
          <stop offset="0.1347" style={{ stopColor: '#814D73'}} />
          <stop offset="0.1883" style={{ stopColor: '#9C557B'}} />
          <stop offset="0.2475" style={{ stopColor: '#B35B82'}} />
          <stop offset="0.3144" style={{ stopColor: '#C76088'}} />
          <stop offset="0.3924" style={{ stopColor: '#D7658D'}} />
          <stop offset="0.4889" style={{ stopColor: '#E36892'}} />
          <stop offset="0.6243" style={{ stopColor: '#EC6B94'}} />
          <stop offset="1" style={{ stopColor: '#F06C95'}} />
        </linearGradient>
      </defs>
      <g>
        <path fill="url(#vizeeLogo_0)" d="M77.68,1.02H72.3H50.51h-6.15h-2.52H29.27h-2.25H1c0,14.46,11.65,26.19,26.02,26.19v0.01h14.82h4.26h4.42 h27.41c1.45,0,2.76,0.31,3.92,0.86c5.31,2.51,7.2,9.94,2.5,14.64L46.16,80.92c1.16, 0.55,2.47,0.86,3.92,0.86H81.9l20.67-20.67 C124.74,38.94,109.04,1.02,77.68,1.02z"/>
        <path fill="url(#vizeeLogo_1)" d="M100.98,81.79v-0.01H91.1h-8.67H81.9H50.07c-1.45,0-2.76-0.31-3.92-0.86c-5.31-2.51-7.2-9.94-2.5-14.64 l38.19-38.19c-1.16-0.55-2.47-0.86-3.92-0.86H50.51H46.1L25.43,47.89c-22.17,22.17-6.47,60.09,24.89,60.09h5.39h26.72h1.21h7.46 h7.63h2.25H127C127,93.51,115.35,81.79,100.98,81.79z"/>
      </g>
    </Svg>
  );
}

Logo.propTypes = {
  size: PropTypes.number
}

Logo.defaultProps = {
  size: 2
}

export default Logo
