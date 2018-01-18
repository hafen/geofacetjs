import React from 'react';
import PropTypes from 'prop-types';
import 'd3-transition';
import { geoMercator, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisLeft } from 'd3-axis';
import { line } from 'd3-shape';
import { format } from 'd3-format';
import { getSquarePath } from '../gridCalc';

class CountryPolygon extends React.Component {
  componentDidMount() {
    // fixes weird behavior on chrome where map disappears temporarily
    // this.props.map.resize();
    this.props.map.easeTo({ pitch: 0, bearing: 0 });

    const cpProjection = geoMercator()
      .center([this.props.center.lng, this.props.center.lat])
      .translate([window.innerWidth / 2, window.innerHeight / 2])
      .scale((((512) * 0.5) / Math.PI) * (this.props.zoom ** 2));

    this.cpPath = geoPath()
      .projection(cpProjection);

    const gridPath = getSquarePath(this.props.d, this.props.grid, cpProjection,
      this.cpPath, this.props.d.properties.gridx, this.props.d.properties.gridy);

    // show countries
    this._d3nodePath
      .attr('d', this.cpPath(this.props.d))
      .style('fill', this.props.cd.colors(this.props.d.properties.avg_val))
      .style('fill-opacity', 0.7)
      .style('stroke-width', 1)
      .style('opacity', 1);

    // transition to grid
    this._d3nodePath
      .transition()
      .duration(2000)
      .attr('d', gridPath);

    // grid labels
    const grid = this.props.grid;
    const gx = this.props.d.properties.gridx;
    const gy = this.props.d.properties.gridy;
    const tx = ((gx - 1) * grid.binSize) + grid.padx + 3;
    const ty = ((gy - 1) * grid.binSize) + grid.pady + 11;

    this._d3nodeText
      .attr('opacity', '0')
      .text(this.props.d.properties.geounit)
      .attr('x', tx)
      .attr('y', ty)
      .attr('font-size', '11px')
      .attr('font-weight', '400')
      .transition(500)
      .delay(1500)
      .attr('opacity', '1');

    // grid axes
    // TODO: fix xs and yaxis tickValues to be adaptive
    const xs = scaleLinear()
      .domain([1992, 2017])
      .range([tx + 12, (tx + grid.binSize) - 6]);
    const ys = scaleLinear()
      .domain([0, 80])
      .range([(ty + grid.binSize) - 4, ty + 17]);

    const yaxis = axisLeft()
      .scale(ys)
      .tickValues([0, 20, 40, 60])
      .tickSizeInner(-(grid.binSize - 14), 0, 0)
      .tickSizeOuter(0)
      .tickPadding(3);

    this._d3nodePlot
      .attr('transform', 'translate(0,-14)')
      .append('g')
      .attr('transform', `translate(${tx + 8},0)`)
      .attr('class', 'y axis')
      .attr('opacity', '0')
      .transition(500)
      .delay(1500)
      .attr('opacity', '1')
      .call(yaxis)
      .selectAll('text')
      .attr('opacity', '0')
      .attr('transform', 'rotate(-90)translate(0,0)')
      .attr('dy', '-3px')
      .style('text-anchor', 'start')
      .attr('opacity', '1');

    // points
    this._d3nodePlot
      .selectAll('.circle')
      .data(this.props.data)
      .enter().append('circle')
      .attr('cx', d => xs(d.x))
      .attr('cy', d => ys(d.y))
      .attr('r', 3)
      .style('stroke-width', '5')
      .attr('opacity', 0)
      .transition()
      .delay(1500)
      .attr('opacity', 1);

    // faux points with tooltip
    const r1 = format('.1f');
    const tooltip = select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('width', '38px')
      .style('margin', 'auto')
      .style('border-radius', '3px')
      .style('height', '36px')
      .style('background', '#000')
      .style('color', 'white')
      .style('font-size', '13px')
      .style('padding', '3px')
      .style('pointer-events', 'none')
      .style('z-index', 10)
      .style('opacity', 0);

    this._d3nodePlot
      .selectAll('.circle2')
      .data(this.props.data)
      .enter()
      .append('circle')
      .attr('cx', d => xs(d.x))
      .attr('cy', d => ys(d.y))
      .attr('r', 9)
      .attr('opacity', 0)
      .on('mouseover', (d) => {
        tooltip
          .transition()
          .duration(100)
          .style('opacity', 0.8);
        tooltip
          .html(`${d.x}<br/>${r1(d.y, 1)}%`)
          .style('left', `${xs(d.x) - 48}px`)
          .style('top', `${ys(d.y) - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(100)
          .style('opacity', 0);
      });

    const dline = line()
      .x(d => xs(d.x))
      .y(d => ys(d.y));

    this._d3nodePlot
      .append('path')
      .datum(this.props.data)
      .attr('d', dline)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('opacity', 0)
      .transition()
      .delay(1500)
      .attr('opacity', 1);
  }
  componentWillLeave(callback) {
    this._d3nodePath
      .transition()
      .duration(2000)
      .attr('d', this.cpPath(this.props.d))
      .transition()
      .duration(1000)
      .style('opacity', 0);

    this._d3nodeText
      .transition(500)
      .attr('opacity', '0');

    this._d3nodePlot
      .transition(500)
      .style('opacity', 0);

    setTimeout(callback, 3000);
  }
  render() {
    return (
      <g>
        <path ref={(d) => { this._d3nodePath = select(d); }} />
        <text ref={(d) => { this._d3nodeText = select(d); }} />
        <g ref={(d) => { this._d3nodePlot = select(d); }} />
      </g>
    );
  }
}

CountryPolygon.propTypes = {
  d: PropTypes.object,
  grid: PropTypes.object,
  center: PropTypes.object,
  zoom: PropTypes.number,
  data: PropTypes.array,
  cd: PropTypes.object,
  map: PropTypes.object
};

export default CountryPolygon;
