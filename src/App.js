import React from 'react';
import _ from "lodash";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import './App.css';

const googleMapAPIRoot = 'https://maps.googleapis.com/maps/api/js'

// Google Maps API url w/ querystrings
const googleMapURL = googleMapAPIRoot.concat('?', 
    // Google Maps API key
    'key=', googleMapAPIKey, '&',
    // Google Maps API libraries
    'libraries=places')

const MyMapComponent = compose(
  withProps({
    googleMapURL,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
    return (
  <GoogleMap defaultZoom={12} defaultCenter={{ lat: 34.0522, lng: -118.2437 }}>
    <Marker position={{ lat: -34.397, lng: 150.644 }} />
  </GoogleMap>)
});

const enhance = _.identity;

const ReactGoogleMaps = () => [
  <MyMapComponent key="map" />
];

export default enhance(ReactGoogleMaps);
