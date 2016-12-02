import { SET_VIEW_MODE, SET_APP_ID, SET_MAP, SET_MAP_LOADED, SET_COUNTRIES,
  SET_GEOJSON_COUNTRIES, SET_GEOJSON_PROVINCES, SET_HOVER_INFO,
  SET_APP_BBOX, SET_VARIABLE, SET_SELECTED, SET_ERROR_MESSAGE,
  SET_COUNTRY_DATA, SET_PROVINCE_DATA } from '../constants';

export const viewMode = (state = 'geo', action) => {
  switch (action.type) {
    case SET_VIEW_MODE:
      return action.mode;
    default:
  }
  return state;
};

export const appId = (state = 'app', action) => {
  switch (action.type) {
    case SET_APP_ID:
      return action.id;
    default:
  }
  return state;
};

export const map = (state = null, action) => {
  switch (action.type) {
    case SET_MAP:
      return action.map;
    default:
  }
  return state;
};

export const mapLoaded = (state = false, action) => {
  switch (action.type) {
    case SET_MAP_LOADED:
      return action.loaded;
    default:
  }
  return state;
};

export const countries = (state = {}, action) => {
  switch (action.type) {
    case SET_COUNTRIES:
      return action.countries;
    default:
  }
  return state;
};

export const geojsonCountries = (state = {}, action) => {
  switch (action.type) {
    case SET_GEOJSON_COUNTRIES:
      return action.data;
    default:
  }
  return state;
};

export const geojsonProvinces = (state = {}, action) => {
  switch (action.type) {
    case SET_GEOJSON_PROVINCES:
      return Object.assign({}, state, action.data);
    default:
  }
  return state;
};

export const countryData = (state = {}, action) => {
  switch (action.type) {
    case SET_COUNTRY_DATA:
      return action.data;
    default:
  }
  return state;
};

export const provinceData = (state = {}, action) => {
  switch (action.type) {
    case SET_PROVINCE_DATA:
      return Object.assign({}, state, action.data);
    default:
  }
  return state;
};

export const hoverInfo = (state = {}, action) => {
  switch (action.type) {
    case SET_HOVER_INFO:
      return action.data;
    default:
  }
  return state;
};

export const variable = (state = null, action) => {
  switch (action.type) {
    case SET_VARIABLE:
      return action.variable;
    default:
  }
  return state;
};

export const selected = (state = '', action) => {
  switch (action.type) {
    case SET_SELECTED:
      return action.name;
    default:
  }
  return state;
};

export const appBBox = (state = null, action) => {
  switch (action.type) {
    case SET_APP_BBOX:
      return action.bbox;
    default:
  }
  return state;
};

export const errorMsg = (state = '', action) => {
  switch (action.type) {
    case SET_ERROR_MESSAGE:
      return action.msg;
    default:
  }
  return state;
};
