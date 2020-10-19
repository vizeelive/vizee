import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
`;

mapboxgl.accessToken =
  'pk.eyJ1IjoicGhpc2h5IiwiYSI6ImNrZ2dvMTU5cjB5ZnIyeXQ5c2kwMzU2bzUifQ.zJXuk0877MIXKz-mOaIhng';

var framesPerSecond = 15;
var initialOpacity = 1;
var opacity = initialOpacity;
var initialRadius = 8;
var radius = initialRadius;
var maxRadius = 18;

// https://dev.to/laney/react-mapbox-beginner-tutorial-2e35
// https://bl.ocks.org/danswick/2f72bc392b65e77f6a9c
const Map = (props) => {
  const map = useRef();
  const timeout = useRef();
  const mapContainerRef = useRef(null);

  let data = props.views.map((view) => {
    let [lat, lng] = view.loc.replace('(', '').replace(')', '').split(',');
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      },
      properties: {
        id: view.id,
        name: view.city
      }
    };
  });

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      // See style options here: https://docs.mapbox.com/api/maps/#styles
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [10.1815316, 36.8064948],
      zoom: 1
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    map.current.on('load', () => {
      map.current.addSource('events', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: data
        }
      });

      map.current.addLayer({
        id: 'point',
        source: 'events',
        type: 'circle',
        paint: {
          'circle-radius': initialRadius,
          'circle-radius-transition': { duration: 0 },
          'circle-opacity-transition': { duration: 0 },
          'circle-color': '#ee6b94'
        }
      });

      map.current.addLayer({
        id: 'point1',
        source: 'events',
        type: 'circle',
        paint: {
          'circle-radius': initialRadius,
          'circle-color': '#ed326e'
        }
      });

      function animateMarker(timestamp) {
        timeout.current = setTimeout(function () {
          requestAnimationFrame(animateMarker);

          radius += (maxRadius - radius) / framesPerSecond;
          opacity -= 0.9 / framesPerSecond;
          if (opacity < 0) opacity = 0;

          if (map) {
            try {
              map.current.setPaintProperty('point', 'circle-radius', radius);
              map.current.setPaintProperty('point', 'circle-opacity', opacity);
            } catch (e) {}
          }

          if (opacity <= 0) {
            radius = initialRadius;
            opacity = initialOpacity;
          }
        }, 1000 / framesPerSecond);
      }

      animateMarker(0);
    });

    return () => {
      clearTimeout(timeout.current);
      map.current.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    map.current.getSource('events') &&
      map.current.getSource('events').setData({
          type: 'FeatureCollection',
          features: data
        });
  }, [data]);

  return <MapContainer className="map-container" ref={mapContainerRef} />;
};

export default Map;
