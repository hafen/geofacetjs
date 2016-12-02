// import React from 'react';
// import injectSheet from 'react-jss';
// // import L from 'leaflet';
// // import topojson from 'topojson';
// import { json as d3json } from 'd3-request';
// import { connect } from 'react-redux';
// import { createSelector } from 'reselect';
// import { windowWidthSelector, windowHeightSelector } from '../selectors/ui';

// class Mapbox extends React.Component {
//   componentDidMount() {
//     // this.map();
//     // this.element = this.refs.map.getLeafletElement();
//   }
//   map() {

//     // http://geojson.xyz/

//     // var layer = L.mapbox.featureLayer()
//     //   .loadURL('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson')
//     //   .addTo(map);

//     // var layer = L.mapbox.featureLayer()
//     //   .loadURL('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson')
//     //   .addTo(map);

//     // map.on('load', () => {

//     //   d3json('../../geojson/province/IND.geojson', json => {
//     //     const a = geojsonExtent(json);

//     //     map.addSource('provinces', { type: 'geojson', data: json });

//     //     map.addLayer({
//     //       id: 'province-fills',
//     //       type: 'fill',
//     //       source: 'provinces',
//     //       paint: {
//     //         'fill-color': 'rgba(200, 100, 240, 0.4)'
//     //       }
//     //     });

//     //     map.addLayer({
//     //       id: 'province-borders',
//     //       type: 'line',
//     //       source: 'provinces',
//     //       paint: {
//     //         'line-color': 'rgba(200, 100, 240, 0.8)'
//     //       }
//     //     });

//     //     map.addLayer({
//     //       id: 'province-fills-hover',
//     //       type: 'fill',
//     //       source: 'provinces',
//     //       paint: {
//     //         'fill-color': 'rgba(200, 100, 240, 0.8)'
//     //       },
//     //       filter: ['==', 'name', '']
//     //     });

//     //     map.fitBounds([
//     //       [a[0], a[1]],
//     //       [a[2], a[3]]
//     //     ], { padding: 20 });

//     //     // When the user moves their mouse over the page, we look for features
//     //     // at the mouse position (e.point) and within the states layer (states-fill).
//     //     // If a feature is found, then we'll update the filter in the province-fills-hover
//     //     // layer to only show that province, thus making a hover effect.
//     //     map.on('mousemove', (e) => {
//     //       const features = map.queryRenderedFeatures(e.point,
//     //         { layers: ['province-fills'] });
//     //       if (features.length) {
//     //         map.setFilter('province-fills-hover', ['==', 'name',
//     //           features[0].properties.name]);
//     //       } else {
//     //         map.setFilter('province-fills-hover', ['==', 'name', '']);
//     //       }
//     //     });

//     //     // Reset the province-fills-hover layer's filter when the mouse leaves the map
//     //     map.on('mouseout', () => {
//     //       map.setFilter('province-fills-hover', ['==', 'name', '']);
//     //     });
//     //   });
//     // });

//     // const layer = L.tileLayer('https://api.mapbox.com/styles/v1/rhafen/civva1zta00052js3cjs98fs3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmhhZmVuIiwiYSI6ImNpdnY5M25oaDAwc24yb281cnFoY3g2YTYifQ.aSlJqMyxuFCtaP6euwu-QA');

//     // const map = L.map('map', {
//     //   zoomControl: false,
//     //   // scrollWheelZoom: false,
//     //   center: [40.7127837, -74.0059413],
//     //   zoom: 6
//     // });

//     // map.addLayer(layer);

//     // map.fitBounds([
//     //     [40.712, -74.227],
//     //     [40.774, -74.125]
//     // ]);

//     // map.flyTo([48.8, 2.4], 10, {
//     //   animate: true,
//     //   duration: 2 // in seconds
//     // });
//   }
//   render() {
//     const { classes } = this.props.sheet;

//     return (
//       <div />
//     );
//   }
// }

// // <div
// //   id="map"
// //   className={classes.bouding}
// //   style={{ width: this.props.width, height: this.props.height }}
// // />

// Mapbox.propTypes = {
//   sheet: React.PropTypes.object,
//   width: React.PropTypes.number,
//   height: React.PropTypes.number
// };

// // ------ static styles ------

// const staticStyles = {
//   bouding: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     borderRight: '1px solid #ddd',
//     boxSizing: 'border-box'
//   }
// };

// // ------ redux container ------

// const stateSelector = createSelector(
//   windowWidthSelector, windowHeightSelector,
//   (width, height) => ({
//     width,
//     height
//   })
// );

// const mapStateToProps = state => (
//   stateSelector(state)
// );

// export default connect(
//   mapStateToProps
// )(injectSheet(staticStyles)(Mapbox));
