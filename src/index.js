import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { json as d3json } from 'd3-request';
import { mean, extent, min, max, ticks } from 'd3-array';
import { scaleQuantize } from 'd3-scale';
import geojsonExtent from 'geojson-extent';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blueA200, lightBlue700, redA200 } from 'material-ui/styles/colors';
import 'react-virtualized/styles.css'; // only needs to be imported once

import { setMapLoaded, setAppBBox, setSelected, setHoverInfo,
  setGeoJsonCountries, setGeoJsonProvinces,
  setCountryData, setProvinceData } from './actions';

import './assets/styles/main.css';
// import './assets/fonts/IcoMoon/style.css';
import './assets/fonts/Gidole/style.css';
import uiConsts from './assets/styles/uiConsts';

import app from './reducers';
import App from './App';

import { countries } from './appData'; // varLookup

const hexToRGB = (hex, bhex, a = 1, a2 = a) => {
  const h = '0123456789ABCDEF';
  const hx = hex.toUpperCase();
  const bhx = bhex.toUpperCase();
  const r3 = (h.indexOf(hx[1]) * 16) + h.indexOf(hx[2]);
  const g3 = (h.indexOf(hx[3]) * 16) + h.indexOf(hx[4]);
  const b3 = (h.indexOf(hx[5]) * 16) + h.indexOf(hx[6]);
  const r2 = (h.indexOf(bhx[1]) * 16) + h.indexOf(bhx[2]);
  const g2 = (h.indexOf(bhx[3]) * 16) + h.indexOf(bhx[4]);
  const b2 = (h.indexOf(bhx[5]) * 16) + h.indexOf(bhx[6]);

  // http://stackoverflow.com/questions/12228548/finding-equivaent-color-with-opacity
  const r1 = Math.max(Math.min(((r3 - r2) + (r2 * a)) / a, 255), 0);
  const g1 = Math.max(Math.min(((g3 - g2) + (g2 * a)) / a, 255), 0);
  const b1 = Math.max(Math.min(((b3 - b2) + (b2 * a)) / a, 255), 0);

  return `rgba(${r1}, ${g1}, ${b1}, ${a2})`;
};

class Root extends Component {
  constructor(props) {
    super(props);

    const el = document.getElementById(this.props.appId);
    el.style.width = `${window.innerWidth}px`;
    el.style.height = `${window.innerHeight}px`;
    el.style.position = 'absolute';
    // el.style.overflow = 'hidden';
    el.style.top = 0;
    el.style.left = 0;
    el.style.zIndex = 2;
    el.style.pointerEvents = 'none';
    const mapDiv = document.createElement('div');
    mapDiv.style.width = `${window.innerWidth}px`;
    mapDiv.style.height = `${window.innerHeight}px`;
    mapDiv.style.position = 'absolute';
    mapDiv.style.top = 0;
    mapDiv.style.left = 0;
    mapDiv.style.zIndex = -1;
    mapDiv.id = 'map';
    // mapDiv.style.overflow = 'hidden';
    // el.appendChild(mapDiv);
    document.getElementsByTagName('body')[0].appendChild(mapDiv);

    mapboxgl.accessToken = 'pk.eyJ1IjoicmhhZmVuIiwiYSI6ImNpdnY5M25oaDAwc24yb281cnFoY3g2YTYifQ.aSlJqMyxuFCtaP6euwu-QA';
    const map = new mapboxgl.Map({
      container: 'map',
      // style: 'mapbox://styles/rhafen/civva1zta00052js3cjs98fs3',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [0, 0],
      zoom: 0
    });

    const loggerMiddleware = createLogger();
    this.store = createStore(
      app,
      { appId: this.props.appId, map, mapLoaded: false, countries, variable: 2 },
      applyMiddleware(thunkMiddleware, loggerMiddleware)
    );

    map.on('load', () => {
      this.store.dispatch(setMapLoaded(true));
    });

    const countryCodes = Object.keys(countries);
    const countryDataGeo = { type: 'FeatureCollection', features: [] };
    const bboxes = {};

    const loadCountriesGeo = () => {
      if (countryCodes.length === 0) {
        this.store.dispatch(setGeoJsonCountries({
          json: countryDataGeo,
          bbox: bboxes
        }));
        // get overall bounding box
        const keys = Object.keys(bboxes);
        const bbox = Object.assign([], [], bboxes[keys[0]]);
        for (let i = 0; i < keys.length; i += 1) {
          const cbbox = bboxes[keys[i]];
          bbox[0] = cbbox[0] < bbox[0] ? cbbox[0] : bbox[0];
          bbox[1] = cbbox[1] < bbox[1] ? cbbox[1] : bbox[1];
          bbox[2] = cbbox[2] > bbox[2] ? cbbox[2] : bbox[2];
          bbox[3] = cbbox[3] > bbox[3] ? cbbox[3] : bbox[3];
        }
        this.store.dispatch(setAppBBox(bbox));
        // now set the map to these bounds
        map.fitBounds([
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]]
        ], { padding: 20 });

        // add layers for these...
        this.addCountryLayer(countryDataGeo, map);

        return;
      }

      const x = countryCodes[0];
      countryCodes.splice(0, 1);

      d3json(`../../data/geojson/country/${x}.geojson`, (err, json) => {
        // if (err) { console.error(err); }
        const mn = this.store.getState().countryData.means[x];
        for (let i = 0; i < json.features.length; i += 1) {
          // eslint-disable-next-line no-param-reassign
          json.features[i].properties.avg_val = mn;
          // eslint-disable-next-line no-param-reassign
          json.features[i].properties.gridx = countries[x].gridx;
          // eslint-disable-next-line no-param-reassign
          json.features[i].properties.gridy = countries[x].gridy;
          countryDataGeo.features.push(json.features[i]);
        }
        bboxes[x] = geojsonExtent(json);
        loadCountriesGeo();
      });
    };

    // load country data
    d3json(`../../data/mpc/country/${this.props.varNum}.json`, (err, json) => {
      // if (err) { console.error(err); }
      // compute means and extents
      const means = {};
      const xExtent = new Array(2);
      const yExtent = new Array(2);
      // json.countries.AFG.data
      const keys = Object.keys(json.countries);
      // need to filter out keys we aren't going to use
      const keys2 = Object.keys(countries);
      keys.filter(n => keys2.indexOf(n) !== -1);

      for (let i = 0; i < keys.length; i += 1) {
        means[keys[i]] = mean(json.countries[keys[i]].data, d => d.value);
        const xExtents = extent(json.countries[keys[i]].data, d => d.year);
        xExtent[0] = min([xExtents[0], xExtent[0]]);
        xExtent[1] = max([xExtents[1], xExtent[1]]);
        const yExtents = extent(json.countries[keys[i]].data, d => d.value);
        yExtent[0] = min([yExtents[0], yExtent[0]]);
        yExtent[1] = max([yExtents[1], yExtent[1]]);
      }

      // get ticks and colors
      const mExtent = extent(Object.keys(means), d => means[d]);
      const tcks = ticks(mExtent[0], mExtent[1], 8);
      const colors = scaleQuantize()
        .domain([tcks[0], tcks[tcks.length - 1]])
        .range(uiConsts.legend.colors);

      this.store.dispatch(setCountryData({
        ...json,
        xExtent,
        yExtent,
        means,
        tcks,
        colors
      }));
      // now we can load countries...
      loadCountriesGeo();
    });

    // hover
    map.on('mousemove', (e) => {
      if (map.getLayer('country-fills')) {
        const features = map.queryRenderedFeatures(e.point,
          { layers: ['country-fills'] });
        if (features.length) {
          map.setFilter('country-fills-hover', ['==', 'name',
            features[0].properties.name]);
          this.setHover(features[0].properties, 'country');
          map.getCanvas().style.cursor = 'pointer';
        } else {
          map.setFilter('country-fills-hover', ['==', 'name', '']);
          this.unsetHover();
          map.getCanvas().style.cursor = '';
        }
      }

      if (map.getLayer('province-fills')) {
        const pfeatures = map.queryRenderedFeatures(e.point,
          { layers: ['province-fills'] });
        if (pfeatures.length) {
          map.setFilter('province-fills-hover', ['==', 'name',
            pfeatures[0].properties.name]);
          this.setHover(pfeatures[0].properties, 'province');
          // map.getCanvas().style.cursor = 'pointer';
        } else {
          map.setFilter('province-fills-hover', ['==', 'name', '']);
          // map.getCanvas().style.cursor = '';
        }
      }
    });

    // reset hover
    map.on('mouseout', () => {
      if (map.getLayer('country-fills')) {
        map.setFilter('country-fills-hover', ['==', 'name', '']);
      }

      if (map.getLayer('province-fills')) {
        map.setFilter('province-fills-hover', ['==', 'name', '']);
      }
    });

    map.on('click', (e) => {
      if (map.getLayer('country-fills')) {
        const features = map.queryRenderedFeatures(e.point,
          { layers: ['country-fills'] });
        if (!features.length) {
          this.unsetZoomCountry(map);
        } else {
          if (map.getLayer('province-fills')) {
            this.removeProvinceLayer(map);
          }
          this.setZoomCountry(features[0].properties, map);
        }
      }
    });

    // // resize handler only when in fullscreen mode (which is always for SPA)
    // window.addEventListener('resize', () => {
    //   if (this.store.getState().fullscreen) {
    //     this.store.dispatch(windowResize({
    //       height: window.innerHeight,
    //       width: window.innerWidth
    //     }));
    //   }
    // });

    // this.store.dispatch(windowResize(appDims));

    this.muiTheme = getMuiTheme({
      fontFamily: '"Open Sans", sans-serif',
      palette: {
        primary1Color: blueA200, // '#4285f4', // lightBlue500,
        primary2Color: lightBlue700,
        accent1Color: redA200
      },
      tableRowColumn: {
        spacing: 10
      },
      tableHeaderColumn: {
        spacing: 10,
        height: 30
      },
      floatingActionButton: {
        miniSize: 30
      }
    });
  }
  setBBox(code) {
    let nbbox;
    if (code === null) {
      nbbox = this.store.getState().appBBox;
    } else {
      nbbox = this.store.getState().geojsonCountries.bbox[code];
    }

    this.store.getState().map.fitBounds([
      [nbbox[0], nbbox[1]],
      [nbbox[2], nbbox[3]]
    ], { padding: 20 });
  }
  setZoomCountry(properties, map) {
    const code = properties.adm0_a3_us;
debugger;
    // if we don't have province data, load it and re-call setZoomCountry
    const pdc = this.store.getState().provinceData[code];
    if (!pdc || !pdc[this.props.varNum]) {
      d3json(`../../data/mpc/province/${code}/${this.props.varNum}.json`, (err, json) => {
        if (err) {
          // if the file doesn't exist, we will populate an empty entry
          this.store.dispatch(setProvinceData({
            [code]: { [this.props.varNum]: {} }
          }));
        } else {
          const means = {};
          const keys = Object.keys(json.provinces);
          for (let i = 0; i < keys.length; i += 1) {
            means[keys[i]] = mean(json.provinces[keys[i]].data, d => d.value);
          }
          this.store.dispatch(setProvinceData({
            [code]: { [this.props.varNum]: { ...json, means } }
          }));
        }
        this.setZoomCountry(properties, map);
      });
    } else {
      const provinceData = pdc[this.props.varNum];
      const provinceDataGeo = this.store.getState().geojsonProvinces[code];
      if (!provinceDataGeo) {
        d3json(`../../data/geojson/province/${code}.geojson`, (err, json) => {
          // if (err) { console.error(err); }
          // set province-level means if specified
          // otherwise just use the country-level avg_val
          if (provinceData.means) {
            for (let i = 0; i < json.features.length; i += 1) {
              const curCode = json.features[i].properties.adm1_code;
              if (!provinceData.means[curCode]) {
                // eslint-disable-next-line no-param-reassign
                json.features[i].properties.avg_val = -99999;
              } else {
                // eslint-disable-next-line no-param-reassign
                json.features[i].properties.avg_val = provinceData.means[curCode];
              }
            }
          } else {
            const mn = this.store.getState().countryData.means[code];
            for (let i = 0; i < json.features.length; i += 1) {
              // eslint-disable-next-line no-param-reassign
              json.features[i].properties.avg_val = mn;
            }
          }
          this.store.dispatch(setGeoJsonProvinces({
            [code]: json
          }));
          this.setZoomCountry(properties, map);
        });
      } else {
        this.addProvinceLayer(provinceDataGeo, map, code);
        this.setBBox(code);
        map.scrollZoom.disable();
        map.boxZoom.disable();
        map.dragRotate.disable();
        map.dragPan.disable();
        map.keyboard.disable();
        map.doubleClickZoom.disable();
        map.touchZoomRotate.disable();
        map.setFilter('country-fills', ['!=', 'adm0_a3_us', code]);
        map.setFilter('country-fills-hover', ['==', 'name', '']);
        this.store.dispatch(setSelected(code));
        map.setFilter('country-borders-selected', ['==', 'adm0_a3_us', code]);
      }
    }
  }
  setHover(properties, type) {
    if (this.store.getState().hoverInfo.name !== properties.name) {
      const data = [];
      if (type === 'country') {
        const cd = this.store.getState().countryData;
        const code = properties.adm0_a3_us;
        cd.countries[code].data.map(d => data.push({ x: d.year, y: d.value }));
      } else if (type === 'province') {
        const pd = this.store.getState().provinceData;
        const ccode = properties.adm0_a3; // should check adm0_a3 is always same as _a3_us
        const code = properties.adm1_code;
        const varNum = this.props.varNum;
        if (pd[ccode] && pd[ccode][varNum] && pd[ccode][varNum].provinces) {
          pd[ccode][varNum].provinces[code].data.map(
            d => data.push({ x: d.year, y: d.value }));
        }
      }

      this.store.dispatch(setHoverInfo({
        name: properties.name,
        properties,
        type,
        data
      }));
    }
  }
  unsetHover() {
    if (this.store.getState().hoverInfo.name !== undefined) {
      this.store.dispatch(setHoverInfo({}));
    }
  }
  removeProvinceLayer(map) {
    if (map.getLayer('province-fills')) {
      map.removeLayer('province-fills');
      map.removeLayer('province-borders');
      map.removeLayer('province-fills-hover');
    }
    // map.setLayoutProperty(`${layerId}-fills`, 'visibility', 'none');
  }
  unsetZoomCountry(map) {
    this.setBBox(null);
    map.scrollZoom.enable();
    map.boxZoom.enable();
    map.dragRotate.enable();
    map.dragPan.enable();
    map.keyboard.enable();
    map.doubleClickZoom.enable();
    map.touchZoomRotate.enable();

    map.setFilter('country-fills', ['!=', 'name', '']);
    map.setFilter('country-fills-hover', ['==', 'name', '']);
    map.setFilter('country-borders-selected', ['==', 'adm0_a3_us', '']);

    this.removeProvinceLayer(map);
  }
  addCountryLayer(data, map) {
    const tcks = this.store.getState().countryData.tcks;
    const colors = this.store.getState().countryData.colors;
    const colMain = tcks.map(d => [d, hexToRGB(colors(d), '#f3f3f1', 0.9, 0.7)]);
    const colHover = tcks.map(d => [d, hexToRGB(colors(d), '#f3f3f1', 0.9, 0.4)]);

    map.addSource('countries', { type: 'geojson', data });

    map.addLayer({
      id: 'country-fills',
      type: 'fill',
      source: 'countries',
      paint: {
        'fill-color': {
          property: 'avg_val',
          stops: colMain
        }
      }
    }, 'country-label-sm');
    // state-label-sm

    map.addLayer({
      id: 'country-borders',
      type: 'line',
      source: 'countries',
      paint: {
        'line-color': {
          property: 'avg_val',
          stops: colHover
        }
      }
    }, 'country-label-sm');

    map.addLayer({
      id: 'country-fills-hover',
      type: 'fill',
      source: 'countries',
      paint: {
        'fill-color': {
          property: 'avg_val',
          stops: colHover
        }
      },
      filter: ['==', 'name', '']
    }, 'country-label-sm');

    map.addLayer({
      id: 'country-borders-selected',
      type: 'line',
      source: 'countries',
      paint: { 'line-color': 'rgba(0, 0, 0, 1)', 'line-width': 5, 'line-blur': 3 },
      // paint: { 'line-color': 'rgba(206, 107, 41, 1)', 'line-width': 5, 'line-blur': 3 },
      // paint: { 'line-color': 'rgb(77, 144, 254)', 'line-width': 12, 'line-blur': 8 },
      filter: ['==', 'name', '']
    }, 'country-label-sm');
  }
  addProvinceLayer(data, map, code) {
    const layerId = `province-${code}`;

    const tcks = this.store.getState().countryData.tcks;
    const colors = this.store.getState().countryData.colors;
    const colMain = tcks.map(d => [d, hexToRGB(colors(d), '#f3f3f1', 0.9, 0.7)]);
    const colHover = tcks.map(d => [d, hexToRGB(colors(d), '#f3f3f1', 0.9, 0.4)]);

    if (!map.getSource(layerId)) {
      map.addSource(layerId, { type: 'geojson', data });
    }

    map.addLayer({
      id: 'province-fills',
      type: 'fill',
      source: layerId,
      paint: {
        'fill-color': {
          property: 'avg_val',
          stops: colMain
        }
      }
    }, 'country-borders-selected'); // make sure country border stays on top

    map.addLayer({
      id: 'province-borders',
      type: 'line',
      source: layerId,
      paint: {
        'line-color': {
          property: 'avg_val',
          stops: colHover
        }
      }
    }, 'country-borders-selected');

    map.addLayer({
      id: 'province-fills-hover',
      type: 'fill',
      source: layerId,
      paint: {
        'fill-color': {
          property: 'avg_val',
          stops: colHover
        }
      },
      filter: ['==', 'name', '']
    }, 'country-borders-selected');
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={this.muiTheme}>
        <Provider store={this.store}>
          <App />
        </Provider>
      </MuiThemeProvider>
    );
  }
}

Root.propTypes = {
  appId: React.PropTypes.string,
  varNum: React.PropTypes.number
};

const geofacet = (id, varNum) => {
  render(
    <Root appId={id} varNum={varNum} />,
    document.getElementById(id)
  );
};

window.geofacet = geofacet;


// https://github.com/callemall/material-ui/tree/master/docs/src/app/components/pages/components
// https://toddmotto.com/react-create-class-versus-component/
// http://stackoverflow.com/questions/35073669/window-resize-react-redux
// hover scroll: http://jsfiddle.net/r36cuuvr/
// https://github.com/StevenIseki/react-search
