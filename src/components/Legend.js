import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// import { quantize } from 'd3-interpolate';
import uiConsts from '../assets/styles/uiConsts';

const Legend = ({ sheet: { classes }, countryData, hoverInfo }) => {
  if (!countryData || !countryData.tcks) {
    return <div />;
  }

  const legend = {
    left: 10,
    top: 20,
    height: uiConsts.legend.entryHeight,
    entryWidth: (uiConsts.legend.width - 20) / countryData.tcks.length
  };

  let curMarker = '';
  const st = countryData.tcks[0];
  const delta = countryData.tcks[1] - countryData.tcks[0];
  if (hoverInfo.name !== undefined) {
    let val = Math.round(hoverInfo.properties.avg_val);
    val = (((val - st + delta) / delta) * legend.entryWidth) + legend.left;
    // https://codepen.io/chrisroselli/pen/oXyqRa - add animation
    curMarker = (
      <line
        x1={val}
        y1={legend.top - 2}
        x2={val}
        y2={legend.top + legend.height + 2}
        strokeWidth="2"
        strokeLinecap="round"
        stroke="black"
      />
    );
  }

  const tcks = [st - delta, ...countryData.tcks];

  return (
    <div className={classes.box}>
      <svg
        width={uiConsts.legend.width}
        height={42}
      >
        <g>
          <text
            x={legend.left}
            y={legend.top - 8}
            className={classes.text}
          >
            {`${countryData.label} (${countryData.measure})`}
          </text>
          <rect
            x={legend.left}
            y={legend.top}
            height={legend.height}
            width={countryData.tcks.length * legend.entryWidth}
            fill="#ffffff"
            stroke="#000000"
            strokeOpacity="0.5"
          />
          {
            countryData.tcks.map((d, i) => (
              <rect
                key={`legend-${i}`}
                x={legend.left + (i * legend.entryWidth)}
                y={legend.top}
                height={legend.height}
                width={legend.entryWidth}
                fill={countryData.colors(d)}
                opacity="0.7"
              />
            ))
          }
          {
            tcks.map((d, i) => (
              <text
                key={`legend-lbl-${i}`}
                x={legend.left + (i * legend.entryWidth)}
                y={legend.top + legend.height + 10}
                className={classes.tickLabel}
                textAnchor="middle"
              >
                {d}
              </text>
            ))
          }
          {curMarker}
        </g>
      </svg>
    </div>
  );

  // const res = (
  //   <div className={classes.box}>
  //     <span className={classes.text}>{countryData.label}</span>
  //   </div>
  // );
  // return res;
};

Legend.propTypes = {
  sheet: React.PropTypes.object,
  countryData: React.PropTypes.object,
  hoverInfo: React.PropTypes.object
};

// ------ static styles ------

const staticStyles = {
  box: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: uiConsts.legend.width,
    background: 'rgba(255, 255, 255, 0.85)',
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    zIndex: 1
  },
  text: {
    fontSize: 12
  },
  tickLabel: {
    fontSize: 9
  }
};

// ------ redux container ------

const countryDataSelector = state => state.countryData;
const hoverInfoSelector = state => state.hoverInfo;

const stateSelector = createSelector(
  countryDataSelector, hoverInfoSelector,
  (countryData, hoverInfo) => ({
    countryData,
    hoverInfo
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(injectSheet(staticStyles)(Legend));
