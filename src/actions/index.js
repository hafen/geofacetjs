// import { json as d3json } from 'd3-request';
// import { default as getJSONP } from 'browser-jsonp';
import { SET_VIEW_MODE, SET_MAP_LOADED, SET_APP_BBOX, SET_HOVER_INFO, SET_SELECTED,
  SET_GEOJSON_COUNTRIES, SET_GEOJSON_PROVINCES,
  SET_COUNTRY_DATA, SET_PROVINCE_DATA } from '../constants';

// SET_APP_ID, SET_MAP, SET_VARIABLE

// const getJSON = obj =>
//   d3json(obj.url, json => obj.callback(json));

export const setViewMode = mode => ({
  type: SET_VIEW_MODE, mode
});

export const setMapLoaded = loaded => ({
  type: SET_MAP_LOADED, loaded
});

export const setHoverInfo = data => ({
  type: SET_HOVER_INFO, data
});

export const setSelected = name => ({
  type: SET_SELECTED, name
});

export const setGeoJsonCountries = data => ({
  type: SET_GEOJSON_COUNTRIES, data
});

export const setGeoJsonProvinces = data => ({
  type: SET_GEOJSON_PROVINCES, data
});

export const setCountryData = data => ({
  type: SET_COUNTRY_DATA, data
});

export const setProvinceData = data => ({
  type: SET_PROVINCE_DATA, data
});

export const setAppBBox = bbox => ({
  type: SET_APP_BBOX, bbox
});
