import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { extent } from 'd3-array';
import { windowWidthSelector, windowHeightSelector } from '../selectors/ui';
import CountryPolygon from './CountryPolygon';
import { getGridProps } from '../gridCalc';

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
    if (this.props.viewMode === 'grid' && this.props.map) {
      feats = this.props.geojsonCountries.json.features;
      const xGridRange = extent(feats, d => d.properties.gridx);
      const yGridRange = extent(feats, d => d.properties.gridy);
      gp = getGridProps(xGridRange, yGridRange);
      cls = `${classes.gridWrapper} ${classes.hideBackground}`
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
            {feats.map((d, i) => (
              <CountryPolygon
                key={new Date().getUTCMilliseconds() + i}
                d={d}
                grid={gp}
                center={this.props.map.getCenter()}
                zoom={this.props.map.getZoom()}
              />
            ))}
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
  geojsonCountries: React.PropTypes.object
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
    transition: 'background-color 1s ease-out',
    opacity: 0.95,
    transitionDelay: '1s'
  },
  hideBackground: {
    transition: 'background-color 1s ease-in',
    transitionDelay: '1s',
    background: 'white',
    pointerEvents: 'all'
  }
};

// ------ redux container ------

const mapSelector = state => state.map;
const viewModeSelector = state => state.viewMode;
const geojsonCountriesSelector = state => state.geojsonCountries;

const stateSelector = createSelector(
  windowWidthSelector, windowHeightSelector, mapSelector, viewModeSelector,
  geojsonCountriesSelector,
  (width, height, map, viewMode, geojsonCountries) => ({
    width,
    height,
    map,
    viewMode,
    geojsonCountries
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(injectSheet(staticStyles)(GeoGrid));
