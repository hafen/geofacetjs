import { geoPath } from 'd3-geo';
import { max } from 'd3-array';
import uiConsts from './assets/styles/uiConsts';

export const getGridProps = (xrange, yrange) => {
  const hh = window.innerHeight;
  const ww = window.innerWidth;
  const grid = {};
  grid.binSize = Math.min((ww - (uiConsts.grid.padding * 2)) / xrange[1],
    (hh - (uiConsts.grid.padding * 2)) / yrange[1]);
  grid.fontStyle = { fontSize: `${Math.min(grid.binSize * 0.15, 12)}px` };
  grid.padx = (ww - (xrange[1] * grid.binSize)) / 2;
  grid.pady = (hh - (yrange[1] * grid.binSize)) / 2;
  return grid;
};

export const getSquarePath = (d, grid, projection, path, gridx, gridy) => {
  if (!gridx) {
    return '';
  }

  const getAngle = (e, c) =>
    Math.atan2(e[1] - c[1], e[0] - c[0]);

  const getLengthForAngle = (phi) => {
    const phi2 = ((((((phi * 180) / Math.PI) + 45) % 90) - 45) / 180) * Math.PI;
    return 1 / Math.cos(phi2);
  };

  const convertCoords = (coords, centx, centy, centroid, placeInCentroid) => {
    const gridPoly = [];
    let curAngle;
    let curRadius;
    // let curCoords;
    // degrees for angles that give corners of square
    const corners = [45, 135, 225, 315, 405];
    for (let i = 0; i < corners.length; i += 1) {
      corners[i] = (corners[i] / 180) * Math.PI;
    }
    const nn = coords.length;

    const startCoords = projection(coords[0]);
    const startAngle = (getAngle(startCoords, centroid) + (2 * Math.PI)) % (2 * Math.PI);
    const angleDelta = (2 * Math.PI) / nn;
    for (let i = 0; i < nn; i += 1) {
      // curCoords = consts.projection(coords[i])
      // curAngle = getAngle(curCoords, d.centroid) + 2 * Math.PI
      if (placeInCentroid) {
        gridPoly.push([centx, centy]);
      } else {
        curAngle = (startAngle + (i * angleDelta)) % (2 * Math.PI);
        for (let k = 0; k < corners.length; k += 1) {
          if (Math.abs(curAngle - corners[k]) < angleDelta) {
            curAngle = corners[k];
          }
        }
        curRadius = (getLengthForAngle(curAngle) * grid.binSize) / 2;
        gridPoly.push([
          centx + (curRadius * Math.cos(curAngle)),
          centy + (curRadius * Math.sin(curAngle))
        ]);
      }
    }
    return gridPoly;
  };

  const centx = ((gridx - 1) * grid.binSize) + grid.padx + (grid.binSize / 2);
  const centy = ((gridy - 1) * grid.binSize) + grid.pady + (grid.binSize / 2);
  const centroid = path.centroid(d);

  const res = [];
  if (d.geometry.type === 'Polygon') {
    const maxCoords = max(d.geometry.coordinates, a => a.length);
    for (let i = 0; i < d.geometry.coordinates.length; i += 1) {
      res.push(convertCoords(d.geometry.coordinates[i], centx, centy, centroid,
        d.geometry.coordinates[i].length < maxCoords));
    }
  } else if (d.geometry.type === 'MultiPolygon') {
    const maxCoords = max(d.geometry.coordinates, a => a[0].length);
    for (let i = 0; i < d.geometry.coordinates.length; i += 1) {
      res.push(convertCoords(d.geometry.coordinates[i][0], centx, centy, centroid,
        d.geometry.coordinates[i][0].length < maxCoords));
    }
  }

  return geoPath().projection(null)({
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: res
      }
    }]
  });
};
