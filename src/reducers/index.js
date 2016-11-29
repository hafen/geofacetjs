import { combineReducers } from 'redux';
import ui from './ui';
import { viewMode, appId, map, mapLoaded, countries, variable, selected, appBBox,
  hoverInfo, geojsonCountries, geojsonProvinces, countryData, provinceData } from './app';
// import _config from './_config';

const app = combineReducers({
  appId,
  viewMode,
  map,
  mapLoaded,
  countries,
  hoverInfo,
  selected,
  geojsonCountries,
  geojsonProvinces,
  countryData,
  provinceData,
  appBBox,
  variable,
  ui
  // _config,
});

export default app;
