import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import SeriesPlot from './SeriesPlot';
// import uiConsts from '../assets/styles/uiConsts';

// if zoomed
//   - show country-level info when nothing is hovered
//     - add note at bottom of this saying
//       - if province info: "Hover a state/province for state-specific information"
//       - else: "State-specific information currently not available for this country"
//     - plus "Click anywhere to exit country-level view"
// if not zoomed
//   - if nothing hovered, show "Hover a country for info"
//   - if country hovered, show country-level info + "Click to view states/provinces"

const addCommas = x =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const InfoOverlay = ({ sheet: { classes }, hoverInfo, xrange, yrange }) => {
  let res = <div />;
  if (hoverInfo.name === undefined) {
    res = (
      <div className={classes.overlay}>
        <h3 className={classes.hInfo}>Hover a country for info</h3>
      </div>
    );
  } else if (hoverInfo.type === 'country') {
// economy (cut off first 3 chars)
// gdp_md_est
// income_grp (cut off first 3 chars)
// lastcensus
// pop_est
// region_wb
// <dt className={classes.dt}><strong>GDP per cap.</strong></dt>
// <dd className={classes.dd}>{addCommas(hoverInfo.properties.gdp_md_est)}</dd>

// <dl className={classes.dl}>
//   <dt className={classes.dt}><strong>Economy</strong></dt>
//   <dd className={classes.dd}>{hoverInfo.properties.economy.substring(3)}</dd>
//   <dt className={classes.dt}><strong>Income Group</strong></dt>
//   <dd className={classes.dd}>{hoverInfo.properties.income_grp.substring(3)}</dd>
//   <dt className={classes.dt}><strong>Population</strong></dt>
//   <dd className={classes.dd}>{addCommas(hoverInfo.properties.pop_est)}</dd>
// </dl>
    res = (
      <div className={classes.overlay}>
        <h3 className={classes.h}>{hoverInfo.properties.geounit}</h3>
        <h4 className={classes.h}>{hoverInfo.properties.region_wb}</h4>
        <hr className={classes.hr} />
        <div className={classes.plotWrapper}>
          <SeriesPlot
            width={200}
            height={160}
            data={hoverInfo.data}
            xrange={xrange}
            yrange={yrange}
          />
        </div>
        <dl className={classes.dl}>
          <dt className={classes.dt}><strong>Average Value</strong></dt>
          <dd className={classes.dd}>{Math.round(hoverInfo.properties.avg_val)}</dd>
        </dl>
        <div>
          <h4 className={`${classes.hInfo} ${classes.spacer}`}>
            Click country to see states
          </h4>
        </div>
      </div>
    );
  } else if (hoverInfo.type === 'province') {
    let plotDiv;
    if (hoverInfo.data.length === 0) {
      plotDiv = (
        <h4 className={`${classes.hInfo} ${classes.spacer}`}>
          State-level data not available
        </h4>
      );
    } else {
      plotDiv = (
        <div>
          <div className={classes.plotWrapper}>
            <SeriesPlot
              width={200}
              height={160}
              data={hoverInfo.data}
              xrange={xrange}
              yrange={yrange}
            />
          </div>
          <dl className={classes.dl}>
            <dt className={classes.dt}><strong>Average Value</strong></dt>
            <dd className={classes.dd}>{Math.round(hoverInfo.properties.avg_val)}</dd>
          </dl>
        </div>
      );
    }
    res = (
      <div className={classes.overlay}>
        <h3 className={classes.h}>{hoverInfo.name}</h3>
        <h4 className={classes.h}>{hoverInfo.properties.geonunit}</h4>
        {plotDiv}
        <div>
          <h5 className={`${classes.hInfo} ${classes.spacer}`}>
            Click anywhere to change focus
          </h5>
        </div>
      </div>
    );
  }
  return res;
};

InfoOverlay.propTypes = {
  sheet: React.PropTypes.object,
  hoverInfo: React.PropTypes.object,
  xrange: React.PropTypes.array,
  yrange: React.PropTypes.array
};

// ------ static styles ------

const staticStyles = {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    background: 'rgba(255, 255, 255, 0.85)',
    marginRight: 10,
    marginTop: 10,
    borderRadius: 5,
    // padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    zIndex: 1
  },
  h: {
    marginBefore: 0,
    marginAfter: 0
    // fontWeight: 300
  },
  hInfo: {
    marginBefore: 0,
    marginAfter: 0,
    fontWeight: 300
  },
  dl: {
    fontSize: 12,
    width: '100%',
    overflow: 'hidden',
    padding: 0,
    margin: 0
  },
  dt: {
    float: 'left',
    width: '38%',
    padding: 0,
    margin: 0
  },
  dd: {
    float: 'left',
    width: '62%',
    padding: 0,
    margin: 0
  },
  hr: {
    border: 0,
    height: 0,
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
  },
  spacer: {
    marginTop: 10
  },
  plotWrapper: {
    paddingTop: 10
  }
};

// ------ redux container ------

const hoverInfoSelector = state => state.hoverInfo;
const countryDataSelector = state => state.countryData;

const stateSelector = createSelector(
  hoverInfoSelector, countryDataSelector,
  (hoverInfo, cd) => ({
    hoverInfo,
    xrange: cd.xExtent,
    yrange: cd.yExtent
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(injectSheet(staticStyles)(InfoOverlay));
