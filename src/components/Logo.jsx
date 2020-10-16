import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Svg = styled.svg`
  width: ${({ size }) => `${size}rem`};
`;

function Logo(props) {
  const { size, hasText, textColor } = props;
  const viewBox = hasText ? '0 0 420 109' : '0 0 128 109';

  return (
    <Svg
      version="1.1"
      viewBox={viewBox}
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
          <stop offset="0" style={{ stopColor: '#183554' }} />
          <stop offset="1.519918e-03" style={{ stopColor: '#1B3655' }} />
          <stop offset="0.0423" style={{ stopColor: '#47395A' }} />
          <stop offset="0.0861" style={{ stopColor: '#673B5F' }} />
          <stop offset="0.1353" style={{ stopColor: '#833C63' }} />
          <stop offset="0.1889" style={{ stopColor: '#9D3B66' }} />
          <stop offset="0.248" style={{ stopColor: '#B43A68' }} />
          <stop offset="0.3148" style={{ stopColor: '#C7386A' }} />
          <stop offset="0.3928" style={{ stopColor: '#D6356B' }} />
          <stop offset="0.4892" style={{ stopColor: '#E2336D' }} />
          <stop offset="0.6245" style={{ stopColor: '#EB326E' }} />
          <stop offset="1" style={{ stopColor: '#EE326E' }} />
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
          <stop offset="1.497918e-08" style={{ stopColor: '#183554' }} />
          <stop offset="0.0417" style={{ stopColor: '#453E5F' }} />
          <stop offset="0.0855" style={{ stopColor: '#654669' }} />
          <stop offset="0.1347" style={{ stopColor: '#814D73' }} />
          <stop offset="0.1883" style={{ stopColor: '#9C557B' }} />
          <stop offset="0.2475" style={{ stopColor: '#B35B82' }} />
          <stop offset="0.3144" style={{ stopColor: '#C76088' }} />
          <stop offset="0.3924" style={{ stopColor: '#D7658D' }} />
          <stop offset="0.4889" style={{ stopColor: '#E36892' }} />
          <stop offset="0.6243" style={{ stopColor: '#EC6B94' }} />
          <stop offset="1" style={{ stopColor: '#F06C95' }} />
        </linearGradient>
      </defs>
      <g>
        <path
          fill="url(#vizeeLogo_0)"
          d="M77.68,1.02H72.3H50.51h-6.15h-2.52H29.27h-2.25H1c0,14.46,11.65,26.19,26.02,26.19v0.01h14.82h4.26h4.42 h27.41c1.45,0,2.76,0.31,3.92,0.86c5.31,2.51,7.2,9.94,2.5,14.64L46.16,80.92c1.16, 0.55,2.47,0.86,3.92,0.86H81.9l20.67-20.67 C124.74,38.94,109.04,1.02,77.68,1.02z"
        />
        <path
          fill="url(#vizeeLogo_1)"
          d="M100.98,81.79v-0.01H91.1h-8.67H81.9H50.07c-1.45,0-2.76-0.31-3.92-0.86c-5.31-2.51-7.2-9.94-2.5-14.64 l38.19-38.19c-1.16-0.55-2.47-0.86-3.92-0.86H50.51H46.1L25.43,47.89c-22.17,22.17-6.47,60.09,24.89,60.09h5.39h26.72h1.21h7.46 h7.63h2.25H127C127,93.51,115.35,81.79,100.98,81.79z"
        />
      </g>
      {hasText && (
        <g>
          <path fill={textColor} d="M182.93,78.32c-1.2,2.95-3.17,4.7-6.13,4.7h-0.55c-2.95,0-5.03-1.75-6.34-4.7l-17.06-41c-0.88-2.41,0.43-5.58,3.17-6.23 c2.62-0.77,5.03,0.55,6.12,3.28l14.32,36.41l14.22-36.41c1.09-2.74,3.5-4.05,6.12-3.28c2.73,0.66,3.94,3.83,3.06,6.23L182.93,78.32z"/>
          <path fill={textColor} d="M215.92,6.27c3.83,0,6.89,2.73,6.89,6.45c0,3.72-3.06,6.45-6.89,6.45c-3.72,0-6.89-2.73-6.89-6.45 C209.04,9,212.21,6.27,215.92,6.27z M220.95,35.9c0-2.73-2.19-5.03-5.03-5.03c-2.73,0-4.92,2.29-4.92,5.03V78 c0,2.73,2.18,5.03,4.92,5.03c2.84,0,5.03-2.29,5.03-5.03V35.9z"/>
          <path fill={textColor} d="M263.59,40.93H239.2c-2.62,0-4.81-2.08-4.81-4.7c0-2.73,2.19-4.81,4.81-4.81h33.9c3.17,0,5.58,2.08,5.58,4.7v0.22 c0,1.97-0.77,3.5-2.41,5.36l-29.08,31.27h26.68c2.63,0,4.81,2.08,4.81,4.81c0,2.63-2.19,4.7-4.81,4.7h-35.65 c-3.17,0-5.58-2.08-5.58-4.7v-0.22c0-1.97,0.77-3.5,2.41-5.36L263.59,40.93z"/>
          <path fill={textColor} d="M332.84,60.72h-37.61c1.2,8.53,7.87,13.89,16.51,13.89c6.13,0,9.51-1.53,13.01-5.36c1.86-2.08,4.7-2.73,6.67-1.31 c1.97,1.53,2.41,4.48,0.88,6.23c-4.92,6.34-12.57,9.4-20.89,9.4c-14.54,0-26.13-10.61-26.13-26.79c0-16.18,11.59-26.46,26.13-26.46 c14.54,0,25.37,10.28,25.37,26.46C336.78,59.08,334.92,60.72,332.84,60.72z M326.94,52.95c-1.2-8.53-7.33-13.67-15.53-13.67 c-8.42,0-14.98,5.14-16.18,13.67H326.94z"/>
          <path fill={textColor} d="M391.06,60.72h-37.62c1.2,8.53,7.87,13.89,16.51,13.89c6.13,0,9.51-1.53,13.01-5.36c1.86-2.08,4.7-2.73,6.67-1.31 c1.97,1.53,2.41,4.48,0.88,6.23c-4.92,6.34-12.58,9.4-20.89,9.4c-14.54,0-26.13-10.61-26.13-26.79c0-16.18,11.59-26.46,26.13-26.46 c14.54,0,25.37,10.28,25.37,26.46C395,59.08,393.14,60.72,391.06,60.72z M385.16,52.95c-1.2-8.53-7.33-13.67-15.53-13.67 c-8.42,0-14.98,5.14-16.18,13.67H385.16z"/>
        </g>
      )}
    </Svg>
  );
}

Logo.propTypes = {
  size: PropTypes.number,
  hasText: PropTypes.bool,
  textColor: PropTypes.string
};

Logo.defaultProps = {
  width: 2,
  hasText: false,
  textColor: 'white'
};

export default Logo;
