import React from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line } from 'd3-shape';
import { timeFormat } from 'd3-time-format';
import { ticks } from 'd3-array';
import { select } from 'd3-selection';

const SeriesPlotD3 = {};

class SeriesPlot extends React.Component {
  componentDidMount() {
    this._d3node
      .call(SeriesPlotD3.enter.bind(this, this.props));
  }
  // shouldComponentUpdate() {
  //   return true;
  // }
  componentDidUpdate() {
    this._d3node
      .call(SeriesPlotD3.update.bind(this, this.props));
  }
  render() {
    return (
      <svg
        ref={(d) => { this._d3node = select(d); }}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

SeriesPlot.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  xrange: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  yrange: PropTypes.array // eslint-disable-line react/no-unused-prop-types
};

export default SeriesPlot;

const getTicksAndRange = (range) => {
  let tcks = ticks(range[0], range[1], 4);
  const tcksd = tcks[1] - tcks[0];
  tcks = [tcks[0] - tcksd, ...tcks, tcks[tcks.length - 1] + tcksd];

  const res = [];
  res[0] = tcks[0];
  res[1] = tcks[tcks.length - 1];
  const pad = (res[1] - res[0]) * 0.07;
  res[0] -= pad;
  res[1] += pad;
  return ({
    range: res,
    ticks: tcks
  });
};

const makeSeriesPlot = (props, selection) => {
  const bPad = 33;
  const lPad = 33;
  const rPad = 10;

  const xtr = getTicksAndRange(props.xrange);
  const ytr = getTicksAndRange(props.yrange);

  const xs = scaleLinear()
    .domain(xtr.range)
    .range([lPad, props.width - rPad]);

  const ys = scaleLinear()
    .domain(ytr.range)
    .range([props.height - bPad, 0]);

  const makeXGrid = () => axisBottom(xs).tickValues(xtr.ticks);
  const makeYGrid = () => axisLeft(ys).tickValues(ytr.ticks);

  selection.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${props.height - bPad})`)
    .call(makeXGrid()
      .tickSizeOuter(0)
      .tickSizeInner(-(props.height - bPad))
      .tickFormat('')
    );

  selection.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(${lPad},0)`)
    .call(makeYGrid()
      .tickSizeOuter(0)
      .tickSizeInner(-(props.width - lPad - rPad))
      .tickFormat('')
    );

  const xaxis = axisBottom(xs)
    .scale(xs)
    .tickValues(xtr.ticks)
    .tickFormat(d => timeFormat('%Y')(new Date(`${d}-01-01`)))
    .tickSizeOuter(0)
    .tickSizeInner(4);

  const yaxis = axisLeft(ys)
    .scale(ys)
    .tickValues(ytr.ticks)
    .tickSizeOuter(0)
    .tickSizeInner(4);

  const dline = line()
    .x(d => xs(d.x))
    .y(d => ys(d.y));

  selection.append('g')
    .attr('transform', `translate(${lPad},0)`)
    .attr('class', 'y axis')
    .call(yaxis)
    .selectAll('text')
    .attr('transform', 'rotate(-90)translate(0,4)')
    .attr('dy', '-12px')
    .style('text-anchor', 'start');

  selection.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(9,${(props.height - bPad) / 2})rotate(-90)`)
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text('Children Stunted (%)');

  selection.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${(props.height - bPad)})`)
    .call(xaxis)
    .selectAll('text')
    .attr('dy', '8px');

  selection.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform',
      `translate(${((props.width - lPad - rPad) / 2) + lPad},${props.height - 1})`)
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text('Year');

  selection.selectAll('.circle')
    .data(props.data)
    .enter().append('circle')
    .attr('cx', d => xs(d.x))
    .attr('cy', d => ys(d.y))
    .attr('r', 4)
    .style('stroke-width', '5')
    .attr('opacity', 1);

  selection.append('path')
    .datum(props.data)
    .attr('d', dline)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('opacity', 0)
    .attr('opacity', 1);
};

SeriesPlotD3.enter = (props, selection) => {
  makeSeriesPlot(props, selection);
};

SeriesPlotD3.update = (props, selection) => {
  selection.selectAll('*').remove();
  makeSeriesPlot(props, selection);
};
