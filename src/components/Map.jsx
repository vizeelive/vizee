import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import styled from 'styled-components';
const turf = require('@turf/turf');

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
  const timeout = useRef();
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // See style options here: https://docs.mapbox.com/api/maps/#styles
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-97.33005299999999, 37.68717609999999],
      zoom: 3.5
    });

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    let filteredEvents = props.events.filter((event) => !!event.location_pos);

    let data = filteredEvents.map((event) => {
      let [lng, lat] = event.location_pos
        .replace('(', '')
        .replace(')', '')
        .split(',');
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        properties: {
          id: event.id,
          name: event.name,
          description: event.description
        }
      };
    });

    map.on('load', () => {
      map.addSource('events', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: data
        }
      });

      map.addLayer({
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

      map.addLayer({
        id: 'point1',
        source: 'events',
        type: 'circle',
        paint: {
          'circle-radius': initialRadius,
          'circle-color': '#ed326e'
        }
      });

      if (data.length > 1) {
        let coords = data?.map((d) => d.geometry.coordinates);
        var line = turf.lineString(coords);
        var box = turf.bbox(line);
        map.fitBounds(box, { padding: 50 });
      }

      function animateMarker(timestamp) {
        timeout.current = setTimeout(function () {
          requestAnimationFrame(animateMarker);

          radius += (maxRadius - radius) / framesPerSecond;
          opacity -= 0.9 / framesPerSecond;
          if (opacity < 0) opacity = 0;

          if (map) {
            try {
              map.setPaintProperty('point', 'circle-radius', radius);
              map.setPaintProperty('point', 'circle-opacity', opacity);
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
      map.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <MapContainer className="map-container" ref={mapContainerRef} />;
};

export default Map;
