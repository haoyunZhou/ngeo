import {toXY as coordinateToXY} from 'gmf/objectediting/coordinate.js';
import olGeomLineString from 'ol/geom/LineString.js';
import olGeomMultiLineString from 'ol/geom/MultiLineString.js';
import olGeomMultiPoint from 'ol/geom/MultiPoint.js';
import olGeomMultiPolygon from 'ol/geom/MultiPolygon.js';
import olGeomPoint from 'ol/geom/Point.js';
import olGeomPolygon from 'ol/geom/Polygon.js';
import olGeomSimpleGeometry from 'ol/geom/SimpleGeometry.js';


/**
 * Determines whether a given geometry is empty or not. A null or undefined
 * value can be given for convenience, i.e. when using methods than can
 * return a geometry or not, for example:
 * `gmf.objectediting.geom.isEmpty(feature.getGeometry())`.
 *
 * @param {?import("ol/geom/Geometry.js").default|undefined} geom Geometry.
 * @return {boolean} Whether the given geometry is empty or not. A null or
 *     undefined geometry is considered empty.
 */
export function isEmpty(geom) {
  let isEmpty = true;
  if (geom && geom instanceof olGeomSimpleGeometry) {
    isEmpty = geom.getFlatCoordinates().length === 0;
  }
  return isEmpty;
}


/**
 * Convert all coordinates within a geometry object to XY, i.e. remove any
 * extra dimension other than X and Y to the coordinates of a geometry.
 *
 * @param {import("ol/geom/Geometry.js").default} geom Geometry
 */
export function toXY(geom) {
  if (geom instanceof olGeomPoint) {
    geom.setCoordinates(coordinateToXY(geom.getCoordinates(), 0)
    );
  } else if (geom instanceof olGeomMultiPoint ||
             geom instanceof olGeomLineString
  ) {
    geom.setCoordinates(coordinateToXY(geom.getCoordinates(), 1)
    );
  } else if (geom instanceof olGeomMultiLineString ||
             geom instanceof olGeomPolygon
  ) {
    geom.setCoordinates(coordinateToXY(geom.getCoordinates(), 2)
    );
  } else if (geom instanceof olGeomMultiPolygon) {
    geom.setCoordinates(coordinateToXY(geom.getCoordinates(), 3)
    );
  } else {
    throw 'gmf.objectediting.geom.toXY - unsupported geometry type';
  }
}
