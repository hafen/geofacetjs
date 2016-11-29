import React from 'react';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line } from 'd3-shape';
import { timeFormat } from 'd3-time-format';
import { ticks } from 'd3-array';
import { select } from 'd3-selection';
// import { format } from 'd3-format';

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
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  data: React.PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  xrange: React.PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  yrange: React.PropTypes.array // eslint-disable-line react/no-unused-prop-types
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
  const bottomPad = 33;
  const leftPad = 33;
  const rightPad = 10;

  const xtr = getTicksAndRange(props.xrange);
  const ytr = getTicksAndRange(props.yrange);

  const xs = scaleLinear()
    .domain(xtr.range)
    .range([leftPad, props.width - rightPad]);

  const ys = scaleLinear()
    .domain(ytr.range)
    .range([props.height - bottomPad, 0]);

  const makeXGrid = () => axisBottom(xs).tickValues(xtr.ticks);
  const makeYGrid = () => axisLeft(ys).tickValues(ytr.ticks);

  selection.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${props.height - bottomPad})`)
    .call(makeXGrid()
      .tickSizeOuter(0)
      .tickSizeInner(-(props.height - bottomPad))
      .tickFormat('')
    );

  selection.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(${leftPad},0)`)
    .call(makeYGrid()
      .tickSizeOuter(0)
      .tickSizeInner(-(props.width - leftPad - rightPad))
      .tickFormat('')
    );

  // const makeXGrid = () => axisBottom(xs).ticks(5);

  // selection.append('g')
  //   .attr('class', 'grid')
  //   .attr('transform', `translate(0,${props.height}`)
  //   .call(makeXGrid()
  //     .tickSize(-props.height)
  //     .tickFormat('')
  //   );


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
    .attr('transform', `translate(${leftPad},0)`)
    .attr('class', 'y axis')
    .call(yaxis)
    .selectAll('text')
    .attr('transform', 'rotate(-90)translate(0,4)')
    .attr('dy', '-12px')
    .style('text-anchor', 'start');

  selection.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(9,${(props.height - bottomPad) / 2})rotate(-90)`)
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text('Children Stunted (%)');

  selection.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${(props.height - bottomPad)})`)
    .call(xaxis)
    .selectAll('text')
    .attr('dy', '8px');

  selection.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${(props.width - leftPad - rightPad) / 2 + leftPad},${props.height - 1})`)
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

  // const tooltip = select('#tooltip')
  //   .attr('class', 'tooltip')
  //   .style('opacity', 0);

  // const r1 = format('.1f');
  // selection.selectAll('.circle2')
  // .data(props.data)
  // .enter().append('circle')
  // .attr('cx', d => xs(d.x))
  // .attr('cy', d => ys(d.y))
  // .attr('r', 9)
  // .attr('opacity', 0)
  // .on('mouseover', (d) => {
  //   tooltip.transition()
  //     .duration(100)
  //     .style('opacity', 0.8);
  //   tooltip.html(`${d.x}<br/>${r1(d.y, 1)}%`)
  //     .style('left', `${xs(d.x) - 48}px`)
  //     .style('top', `${ys(d.y) - 28}px`);
  // })
  // .on('mouseout', () => {
  //   tooltip.transition()
  //     .duration(100)
  //     .style('opacity', 0);
  // });

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


// SeriesPlotD3.enter = (props, pars, selection) => {
//   const plotArea = selection.append('g');

//   const selRange = Object.assign([], pars.xrange);
//   if (props.filterState.value) {
//     if (props.filterState.value.from) {
//       selRange[0] = props.filterState.value.from;
//     }
//     if (props.filterState.value.to) {
//       selRange[1] = props.filterState.value.to;
//     }
//   }

//   plotArea.append('path')
//     .attr('class', 'bar foreground')
//     .datum(props.condDist.dist)
//     .attr('clip-path', `url(#clip-${props.name})`);

//   if (props.filterState.value) {
//     plotArea.selectAll('.foreground')
//       .attr('fill', 'rgb(255, 170, 10)');
//   } else {
//     plotArea.selectAll('.foreground')
//       .attr('fill', 'rgb(255, 210, 127)');
//   }

//   const gAxis = selection.append('g')
//     .attr('class', 'axis')
//     .attr('transform', `translate(0,${(props.height - pars.axisPad) + 1})`)
//     .call(pars.axis);

//   // style the axis
//   gAxis.select('path')
//     .attr('fill', 'none')
//     .attr('stroke', '#000')
//     .attr('stroke-opacity', 0.4)
//     .attr('shape-rendering', 'crispEdges');
//   gAxis.selectAll('.tick')
//     .attr('opacity', 0.4);
//   // gAxis.selectAll('.tick text')
//   //   .attr('font', '10px');

//   selection.selectAll('.bar').attr('d', d => pars.barPath(d, pars));
// };
