import React from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { geoMercator, geoPath } from 'd3-geo';
import { getSquarePath } from '../gridCalc';

class CountryPolygon extends React.Component {
  componentDidMount() {
    const color = '#ddd'; // fix this...

    const cpProjection = geoMercator()
      .center([this.props.center.lng, this.props.center.lat])
      .translate([window.innerWidth / 2, window.innerHeight / 2])
      .scale((((512) * 0.5) / Math.PI) * (this.props.zoom ** 2));

    const cpPath = geoPath()
      .projection(cpProjection);

    const gridPath = getSquarePath(this.props.d, this.props.grid, cpProjection, cpPath,
      this.props.d.properties.gridx, this.props.d.properties.gridy);

    this._d3nodePath
      .attr('d', cpPath(this.props.d))
      // .attr('transform', this.props.transform)
      .style('fill', color)
      // .style('fill-opacity', 0.65)
      .style('stroke-width', 1)
      .style('opacity', 1);

    this._d3nodePath
      .transition().duration(2000)
      .attr('d', gridPath);

    const grid = this.props.grid;
    const gx = this.props.d.properties.gridx;
    const gy = this.props.d.properties.gridy;
    const tx = ((gx - 1) * grid.binSize) + grid.padx + 4;
    const ty = ((gy - 1) * grid.binSize) + grid.pady + 12 + 3;

    this._d3nodeText
      .attr('opacity', '0')
      .text(this.props.d.properties.name)
      .attr('x', tx)
      .attr('y', ty)
      .transition(500)
      .delay(1500)
      .attr('opacity', '1');

      // .call(CountryPolyD3.enter.bind(this, this.props));
  }
  // shouldComponentUpdate(nextProps) {
  //   return nextProps.transform !== this.props.transform ||
  //     nextProps.viewMode !== this.props.viewMode
  // }
  componentDidUpdate() {
    // this._d3node
    //   .call(CountryPolyD3.update.bind(this, this.props));
  }
  componentWillLeave(callback) {
    const cpProjection = geoMercator()
      .center([this.props.center.lng, this.props.center.lat])
      .translate([window.innerWidth / 2, window.innerHeight / 2])
      .scale((((512) * 0.5) / Math.PI) * (this.props.zoom ** 2));

    const cpPath = geoPath()
      .projection(cpProjection);

    this._d3nodeText
      .transition(500)
      .attr('opacity', '0');

    this._d3nodePath
      .transition()
      .duration(2000)
      .attr('d', cpPath(this.props.d))
      .transition()
      .duration(1000)
      .style('opacity', 0);

    setTimeout(callback, 3000);

      // .call(CountryPolyD3.leave.bind(this, this.props, callback));
  }
  render() {
    return (
      <g>
        <path ref={(d) => { this._d3nodePath = select(d); }} />
        <text ref={(d) => { this._d3nodeText = select(d); }} />
      </g>
    );
  }
}

CountryPolygon.propTypes = {
  d: React.PropTypes.object,
  grid: React.PropTypes.object,
  center: React.PropTypes.object,
  zoom: React.PropTypes.number
};

// transform="translate(-475,-158)scale(2.1)"
// <g transform={this.props.transform}>

// CountryPolyD3.update = (props, selection) => {
//   // determine which view we are in so we know how to morph the polygons
//   const prevViewMode = selection.select('path').property('prevViewMode');

//   if(props.viewMode === 'map') {
//     if(prevViewMode === 'map') {
//       // zooming in map mode
//       selection.select('path')
//         .transition().duration(consts.transformDuration)
//         .attr('transform', props.transform)
//         .style('stroke-width', polyStrokeWidth(props.scale, props.zoomed))
//     } else if(prevViewMode === 'geoGrid' || prevViewMode === 'clusterGrid') {
//       // handle going from geoGrid back to map
//       selection.select('path')
//         .property({prevViewMode: 'map'})

//       selection.select('path.country')
//         .transition().duration(1000)
//         .delay(1500)
//         .attr('transform', props.transform)
//         .style('opacity', '1')
//         .style('stroke-width', polyStrokeWidth(props.scale, props.zoomed))

//       selection.select('path.active-country')
//         .transition().duration(2000)
//         .attr('transform', props.transform)
//         .style('fill', consts.colors(props.d.stuntAvg))
//         .attr('d', consts.path(props.d))
//         .style('stroke-width', polyStrokeWidth(props.scale, props.zoomed))
//     }
//   } else if(props.viewMode === 'geoGrid') {
//     selection.select('path')
//       .property({prevViewMode: 'geoGrid'})

//     if(prevViewMode === 'geoGrid') {
//       // must be a resize
//       var gridPath = getSquarePath(props.d, props.grid, consts.projection,
//         props.d.gridx, props.d.gridy)
//       selection.select('path.active-country')
//         .transition().duration(200)
//         .attr('d', gridPath)
//     } else if(prevViewMode === 'map') {
//       // handle going from map to geoGrid

//       var gridPath = getSquarePath(props.d, props.grid, consts.projection,
//         props.d.gridx, props.d.gridy)

//       selection.select('path.country')
//         .transition().duration(1000)
//         .style('opacity', '0')

//       selection.select('path.active-country')
//         .transition().duration(2000)
//         .attr('transform', 'translate(0)scale(1)')
//         .style('fill', consts.colors(props.d.stuntAvg))
//         .attr('d', gridPath)
//         .style('stroke-width', 2)
//     } else if(prevViewMode === 'clusterGrid') {
//       // handle going from clusterGrid to geoGrid
//       var gridPath = getSquarePath(props.d, props.grid, consts.projection,
//         props.d.gridx, props.d.gridy)

//       selection.select('path.active-country')
//         .transition().duration(2000)
//         .attr('transform', 'translate(0)scale(1)')
//         .style('fill', consts.colors(props.d.stuntAvg))
//         .attr('d', gridPath)
//         .style('stroke-width', 2)
//     }
//   } else if(props.viewMode === 'clusterGrid') {
//     if(prevViewMode === 'clusterGrid') {
//       // must be resize
//       if(props.d.active) {
//         var gridPath = getSquarePath(props.d, props.clgrid, consts.projection,
//           props.clgridcrd.gridx, props.clgridcrd.gridy)

//         selection.select('path.active-country')
//           .transition().duration(400)
//           .attr('d', gridPath)
//       }
//     } else {
//     // if(prevViewMode === 'map') {
//       // handle going from map to clusterGrid
//       selection.select('path')
//         .property({prevViewMode: 'clusterGrid'})

//       selection.select('path.country')
//         .transition().duration(1000)
//         .style('opacity', '0')

//       if(props.d.active) {
//         var gridPath = getSquarePath(props.d, props.clgrid, consts.projection,
//           props.clgridcrd.gridx, props.clgridcrd.gridy)

//         selection.select('path.active-country')
//           .transition().duration(2000)
//           .style('fill', consts.clusterColors[props.clgridcrd.cl - 1])
//           .attr('transform', 'translate(0)scale(1)')
//           .attr('d', gridPath)
//           .style('stroke-width', 4)
//       }
//     }
//   }
// }

export default CountryPolygon;
