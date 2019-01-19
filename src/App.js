// google is injected with script tag, need to satisfy linter
// https://github.com/tomchentw/react-google-maps/issues/434

/* global google */

import React from 'react';
import _ from "lodash";
import { compose, withProps, lifecycle } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox"
import './App.css';

const googleMapAPIRoot = 'https://maps.googleapis.com/maps/api/js'

// Google Maps API url w/ querystrings
const googleMapURL = googleMapAPIRoot.concat('?', 
    // Google Maps API key
    'key=', googleMapAPIKey, '&',
    // Google Maps API libraries
    'libraries=places')

const MapWithASearchBox = compose(
  withProps({
    googleMapURL,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        center: {
          lat: 34.0522, lng: -118.2437
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={12}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Search The Green Book"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `40px`,
          marginTop: `10px`,
          padding: `0 12px`,
          borderRadius: `2px`,
          boxShadow: `rgba(0, 0, 0, 0.3) 0px 1px 4px -1px`,
          fontSize: `16px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
  </GoogleMap>
);

export default MapWithASearchBox;
