import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { extent } from 'd3-array';
import { windowWidthSelector, windowHeightSelector } from '../selectors/ui';
import CountryPolygon from './CountryPolygon';
import { getGridProps } from '../gridCalc';
import { getXYData } from '../misc';

class GeoGrid extends React.Component {
  componentDidMount() {
    // this.map();
    // this.element = this.refs.map.getLeafletElement();
  }
  componentDidUpdate() {
  }
  render() {
    const { classes } = this.props.sheet;

    let feats = [];
    let gp = {};
    let cls = classes.gridWrapper;
    if (this.props.viewMode === 'grid' && this.props.map && this.props.geojsonCountries.json) {
      feats = this.props.geojsonCountries.json.features;
      const xGridRange = extent(feats, d => d.properties.gridx);
      const yGridRange = extent(feats, d => d.properties.gridy);
      gp = getGridProps(xGridRange, yGridRange);
      cls = `${classes.gridWrapper} ${classes.hideBackground}`;
    }

    const style = { width: this.props.width, height: this.props.height };

    return (
      <div
        className={cls}
        style={style}
      >
        <svg
          id="worldMap"
          // ref="worldMap"
          width={this.props.width}
          height={this.props.height}
        >
          <ReactTransitionGroup component="g">
            {feats.map((d, i) => {
              const type = 'country'; // will support province in the future...
              let data;
              if (type === 'country') {
                data = getXYData(this.props.cd, d.properties, type,
                  this.props.varNum);
              } else if (type === 'province') {
                data = getXYData(this.props.pd, d.properties, type,
                  this.props.varNum);
              }

              return (
                <CountryPolygon
                  key={new Date().getUTCMilliseconds() + i}
                  d={d}
                  data={data}
                  cd={this.props.cd}
                  grid={gp}
                  center={this.props.map.getCenter()}
                  zoom={this.props.map.getZoom()}
                  map={this.props.map}
                />
              );
            })}
          </ReactTransitionGroup>
        </svg>
      </div>
    );
    // grid={this.state.gridProps}
    // clgridcrd={this.state.clGridCoords[d.id]}
    // clgrid={this.state.clGridProps}
  }
}

// <div
//   id="map"
//   className={classes.bouding}
//   style={{ width: this.props.width, height: this.props.height }}
// />

GeoGrid.propTypes = {
  sheet: React.PropTypes.object,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  viewMode: React.PropTypes.string,
  map: React.PropTypes.object,
  geojsonCountries: React.PropTypes.object,
  cd: React.PropTypes.object,
  pd: React.PropTypes.object,
  varNum: React.PropTypes.number
};

// ------ static styles ------

const staticStyles = {
  gridWrapper: {
    position: 'absolute',
    overflow: 'hidden',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    borderRight: '1px solid #ddd',
    boxSizing: 'border-box',
    transition: 'background-color 1s ease-in',
    opacity: 0.95,
    transitionDelay: '0.5s'
  },
  hideBackground: {
    transition: 'background-color 1s ease-out',
    transitionDelay: '0.5s',
    background: 'white',
    pointerEvents: 'all'
  }
};

// ------ redux container ------

const mapSelector = state => state.map;
const viewModeSelector = state => state.viewMode;
const geojsonCountriesSelector = state => state.geojsonCountries;
const countryDataSelector = state => state.countryData;
const provinceDataSelector = state => state.provinceData;
const varNumSelector = state => state.variable;

const stateSelector = createSelector(
  windowWidthSelector, windowHeightSelector, mapSelector, viewModeSelector,
  geojsonCountriesSelector, countryDataSelector, provinceDataSelector, varNumSelector,
  (width, height, map, viewMode, geojsonCountries, cd, pd, varNum) => ({
    width,
    height,
    map,
    viewMode,
    geojsonCountries,
    cd,
    pd,
    varNum
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(injectSheet(staticStyles)(GeoGrid));
