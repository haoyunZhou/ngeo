/**
 * @module ngeo.datasource.OGC
 */
import googAsserts from 'goog/asserts.js';
import ngeoDatasourceDataSource from 'ngeo/datasource/DataSource.js';
import ngeoFilterCondition from 'ngeo/filter/Condition.js';
import ngeoFormatAttributeType from 'ngeo/format/AttributeType.js';
import olFormatGML2 from 'ol/format/GML2.js';
import olFormatGML3 from 'ol/format/GML3.js';
import olFormatWFS from 'ol/format/WFS.js';
import olFormatWMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo.js';


/**
 * Dimensions definition.
 * @typedef {Object.<string, ?string>} Dimensions
 */


/**
 * Available OGC server types.
 * @enum {string}
 */
export const ServerType = {
  GEOSERVER: 'geoserver',
  MAPSERVER: 'mapserver',
  QGISSERVER: 'qgisserver'
};


/**
 * Available OGC types.
 * @enum {string}
 */
export const Type = {
  WMS: 'WMS',
  WMTS: 'WMTS'
};


/**
 * Available Feature prefix for WFS requests.
 * @enum {string}
 */
const WFSFeaturePrefix = {
  FEATURE: 'feature'
};


/**
 * Available OutputFormat for WFS requests.
 * @enum {string}
 */
export const WFSOutputFormat = {
  GML2: 'GML2',
  GML3: 'GML3'
};


/**
 * Available InfoFormat for WMS requests.
 * @enum {string}
 */
export const WMSInfoFormat = {
  GML: 'application/vnd.ogc.gml'
};


/**
 * The options required to create a `OGC`.
 *
 * activeDimensions: The dimensions that are currently active on the data source.
 *
 * copyable: Whether the geometry from this data source can be copied to other data
 * sources or not. Defaults to `false`.
 *
 * dimensions: A reference to the dimensions.
 *
 * dimensionsConfig: The dimensions configuration, which determines those supported by this data
 * source and whether they should use a static value or the one defined in the
 * dimensions.
 *
 * filterCondition: The filter condition to apply to the filter rules (if any). Defaults to
 * `ngeo.filter.Condition.AND`.
 *
 * filterRules: A list of filter rules to apply to this data source using the filter condition.
 *
 * filtrable: Whether the data source is filtrable or not.
 *
 * geometryName: The name of the geometry attribute.
 *
 * ogcImageType: The type of images to fetch by queries by the (WMS) or (WMTS).
 *
 * ogcLayers: A list of layer definitions that are used by (WMS) and (WFS) queries.
 * These are **not** used by the (WMTS) queries (the wmtsLayers is used
 * by WMTS queries).
 *
 * ogcServerType: The type of OGC server.
 *
 * ogcType: The type data source. Can be: 'WMS' or 'WMTS'.
 *
 * snappable: Whether the geometry from this data source can be used to snap the geometry
 * of features from other data sources that are being edited. Defaults to `false`.
 *
 * snappingToEdges: Determines whether external features can be snapped to the edges of
 * features from this data source or not. Defaults to `true`. Requires `snappable` to be set.
 *
 * snappingToVertice: Determines whether external features can be snapped to the vertice of
 * features from this data source or not. Defaults to `true`. Requires `snappable` to be set.
 *
 * snappingTolerance: The tolerance in pixels the snapping should occur. Defaults to `10`.
 *
 * timeAttributeName: The name of the time attribute.
 *testgeomapfishapp
 * timeLowerValue: The time lower value, which can be combined with the time upper value
 * to determine a range.
 *
 * timeProperty: The time property for the data source. Used to apply time filters.
 *
 * timeUpperValue: The time upper value, which can be combined with the time lower value
 * to determine a range.
 *
 * wfsFeatureNS: The feature namespace to use with WFS requests.
 *
 * wfsFeaturePrefix: The feature prefix to use with WFS requests.
 *
 * wfsOutputFormat: The OutputFormat to use with WFS requests.
 *
 * wfsUrl: The URL to use for (WFS) requests.
 *
 * wmsInfoFormat: The InfoFormat to use with WMS requests.
 *
 * wmsIsSingleTile: Whether the (WMS) images returned by this data source should be single tiles
 * or not. Defaults to `false`
 *
 * wmsUrl: The URL to use for (WMS) requests.
 *
 * wmtsLayer: The layer name to use for the (WMTS) requests.
 *
 * wmtsUrl: The URL to use for (WMTS) requests.
 *
 * @typedef {{
 *   activeDimensions: (Dimensions|undefined),
 *   copyable: (boolean|undefined),
 *   dimensions: (Dimensions|undefined),
 *   dimensionsConfig: (Dimensions|undefined),
 *   filterCondition: (string|undefined),
 *   filterRules: (!Array.<!Rule>|undefined),
 *   filtrable: (boolean|undefined),
 *   geometryName: (string|undefined),
 *   ogcImageType: (string|undefined),
 *   ogcLayers: (Array.<!OGCLayer>|undefined),
 *   ogcServerType: (string|undefined),
 *   ogcType: (string|undefined),
 *   snappable: (boolean|undefined),
 *   snappingToEdges: (boolean|undefined),
 *   snappingToVertice: (boolean|undefined),
 *   snappingTolerance: (number|undefined),
 *   timeAttributeName: (string|undefined),
 *   timeLowerValue: (number|undefined),
 *   timeProperty: (TimeProperty|undefined),
 *   timeUpperValue: (number|undefined),
 *   wfsFeatureNS: (string|undefined),
 *   wfsFeaturePrefix: (string|undefined),
 *   wfsOutputFormat: (string|undefined),
 *   wfsUrl: (string|undefined),
 *   wmsInfoFormat: (string|undefined),
 *   wmsIsSingleTile: (boolean|undefined),
 *   wmsUrl: (string|undefined),
 *   wmtsLayer: (string|undefined),
 *   wmtsUrl: (string|undefined,
 * }} OGCOptions
 * @extends DataSourceOptions
 */


/**
 * combinableWithDataSourceForWFS: Whether this data source can be combined to the given
 *     other data source to fetch features in a single WFS request.
 *
 * combinableWithDataSourceForWMS:  Whether this data source can be combined to the given
 *     other data source to fetch features in a single WMS request.
 *
 * haveTheSameActiveDimensions: Remote data source to compare with this one.
 * Whether the two data sources have the same active
 *     dimensions. If both have no dimensions, they are considered to be
 *     sharing the same dimensions.
 *
 * @typedef {{
 *   activeDimensions: (DimensionsActive),
 *   combinableForWMS: (boolean),
 *   combinableForWFS: (boolean),
 *   supportsWFS: (boolean),
 *   supportsWMS: (boolean),
 *   wmsUrl: (string|undefined),
 *   wfsUrl: (string|undefined),
 *   filterCondition: (string),
 *   filterRules: (?Array.<!Rule>),
 *   combinableWithDataSourceForWFS: (function(OGC): boolean),
 *   combinableWithDataSourceForWMS: (function(OGC): boolean),
 *   haveTheSameActiveDimensions: (function(OGC): boolean),
 * }} OGC
 * @extends DataSource
 */


/**
 * The definition of a single layer (WMS) and/or featureType (WFS).
 *
 * maxResolution: The maximum resolution the layer should be rendered (when visible).
 *
 * minResolution: The minimum resolution the layer should be rendered (when visible).
 *
 * name: The layer name (WMS) and/or feature type name (WFS)
 *
 * queryable: Whether the the layer is queryable or not. Defaults to `false`.
 *
 * @typedef {{
 *   maxResolution: (number|undefined),
 *   minResolution: (number|undefined),
 *   name: (string),
 *   queryable: (boolean|undefined)
 * }} OGCLayer
 */


/**
 * Time object
 * @typedef {{
 *  widget: TimePropertyWidgetEnum,
 *  maxValue: string,
 *  minValue: string,
 *  maxDefValue: (string|null),
 *  minDefValue: (string|null),
 *  mode: TimePropertyModeEnum,
 *  resolution: (TimePropertyResolutionEnum|undefined),
 *  values: (Array<string>|undefined),
 *  interval : Array<number>
 * }} TimeProperty
 */


/**
 * @typedef {{
 *     end: (number|undefined),
 *     start: number
 * }} TimeRange
 */


/**
 * Active dimensions definition, where the value can't be null.
 * @typedef {Object.<string, string>} DimensionsActive
 */


/**
 * Default name of the geometry attribute.
 * @type {string}
 */
const DEFAULT_GEOMETRY_NAME = 'geom';


/**
 * @implements {OGC}
 */
export default class extends ngeoDatasourceDataSource {

  /**
   * A data source contains information of a single source of data that can
   * show or fetch the data using an OGC server. Several OGC service types are
   * supported by this data source: WMS, WMTS and even WFS.
   *
   * You can use the information stored within an OGC data source to do all
   * sorts of things:
   * - issue WMS/WFS queries
   * - apply filter rules on it
   * - create `ol.layer.Layer` objects using the WMS, WMTS or event WFS
   *   information
   *
   * @param {OGCOptions} options Options.
   */
  constructor(options) {

    super(options);

    // === DYNAMIC properties (i.e. that can change / be watched) ===

    /**
     * The dimensions configuration for the data source.
     * @type {?Dimensions}
     */
    this.dimensionsConfig = options.dimensionsConfig || null;

    /**
     * The dimensions applied by filters configuration for the data source.
     * @type {?DimensionsFiltersConfig}
     */
    this.dimensionsFiltersConfig = options.dimensionsFiltersConfig || null;

    /**
     * The filter condition to apply to the filter rules (if any).
     * @type {string}
     */
    this.filterCondition = options.filterCondition || ngeoFilterCondition.AND;

    /**
     * A list of filter rules to apply to this data source using the filter
     * condition.
     * @type {?Array.<!ngeo.rule.Rule>}
     */
    this.filterRules = options.filterRules || null;

    /**
     * Whether the data source is filtrable or not. When `null`, that means
     * that we do not know if the data source if filtrable or not, yet. In
     * that case, the value of the property needs to be determined from an
     * external way.
     * @type {?boolean}
     */
    this.filtrable = options.filtrable || null;


    // === STATIC properties (i.e. that never change) ===

    /**
     * Whether the geometry from this data source can be copied to other data
     * sources or not. Defaults to `false`.
     * @type {boolean}
     * @private
     */
    this.copyable_ = options.copyable === true;

    /**
     * A reference to the dimensions object.
     * @type {?Dimensions}
     * @private
     */
    this.dimensions_ = options.dimensions || null;

    /**
     * The name of the geometry attribute.
     * @type {string}
     * @private
     */
    this.geometryName_ = options.geometryName || DEFAULT_GEOMETRY_NAME;

    /**
     * The type of images to fetch by queries by the (WMS) or (WMTS) .
     * @type {string}
     * @private
     */
    this.ogcImageType_ = options.ogcImageType || 'image/png';

    /**
     * A list of layer definitions that are used by (WMS) and (WFS) queries.
     * These are **not** used by the (WMTS) queries (the wmtsLayers is used
     * by WMTS queries).
     * @type {?Array.<!OGCLayer>}
     * @private
     */
    this.ogcLayers_ = options.ogcLayers || null;

    /**
     * The type of OGC server making the requests.
     * @type {string}
     * @private
     */
    this.ogcServerType_ = options.ogcServerType || ServerType.MAPSERVER;

    /**
     * The type data source. Can be: 'WMS' or 'WMTS'.
     * @type {string}
     * @private
     */
    this.ogcType_ = options.ogcType || Type.WMS;

    /**
     * Whether the geometry from this data source can be used to snap the
     * geometry of features from other data sources that are being edited.
     * Defaults to `false`.
     * @type {boolean}
     * @private
     */
    this.snappable_ = options.snappable === true;

    /**
     * Determines whether external features can be snapped to the edges of
     * features from this data source or not. Defaults to `true`. Requires
     * `snappable` to be set.
     * @type {boolean}
     * @private
     */
    this.snappingToEdges_ = options.snappingToEdges !== false;

    /**
     * Determines whether external features can be snapped to the vertice of
     * features from this data source or not. Defaults to `true`. Requires
     * `snappable` to be set.
     * @type {boolean}
     * @private
     */
    this.snappingToVertice_ = options.snappingToVertice !== false;

    /**
     * The tolerance in pixels the snapping should occur. Defaults to `10`.
     * @type {number}
     * @private
     */
    this.snappingTolerance_ = options.snappingTolerance !== undefined ? options.snappingTolerance : 10;

    /**
     * The name of the time attribute.
     * @type {string|undefined}
     * @private
     */
    this.timeAttributeName_ = options.timeAttributeName;

    /**
     * Time lower value.
     * @type {number|undefined}
     */
    this.timeLowerValue = options.timeLowerValue;

    /**
     * @type {?TimeProperty}
     * @private
     */
    this.timeProperty_ = options.timeProperty !== undefined ? options.timeProperty : null;

    /**
     * Time upper value.
     * @type {number|undefined}
     * @private
     */
    this.timeUpperValue = options.timeUpperValue;

    /**
     * The feature namespace to use with WFS requests.
     * @type {string}
     * @private
     */
    this.wfsFeatureNS_ = options.wfsFeatureNS;

    /**
     * The feature prefix to use with WFS requests.
     * @type {string}
     * @private
     */
    this.wfsFeaturePrefix_ = options.wfsFeaturePrefix || WFSFeaturePrefix.FEATURE;

    /**
     * The OutputFormat to use with WFS requests.
     * @type {string}
     * @private
     */
    this.wfsOutputFormat_ = options.wfsOutputFormat || WFSOutputFormat.GML3;

    /**
     * The url to use for (WFS) requests.
     * @type {string|undefined}
     * @private
     */
    this.wfsUrl_ = options.wfsUrl;

    /**
     * The InfoFormat to use with WMS requests.
     * @type {string}
     * @private
     */
    this.wmsInfoFormat_ = options.wmsInfoFormat || WMSInfoFormat.GML;

    /**
     * Whether the (WMS) images returned by this data source
     * should be single tiles or not.
     * @type {boolean}
     * @private
     */
    this.wmsIsSingleTile_ = options.wmsIsSingleTile === true;

    /**
     * The url to use for (WMS) requests.
     * @type {string|undefined}
     * @private
     */
    this.wmsUrl_ = options.wmsUrl;

    /**
     * The layer name to use for the (WMTS) requests.
     * @type {string|undefined}
     * @private
     */
    this.wmtsLayer_ = options.wmtsLayer;

    /**
     * The url to use for (WMTS) requests.
     * @type {string|undefined}
     * @private
     */
    this.wmtsUrl_ = options.wmtsUrl;


    // === Calculated properties ===

    // Get queryable ogc layer names
    const layers = [];
    if (this.queryable && this.ogcLayers) {
      for (const ogcLayer of this.ogcLayers) {
        if (ogcLayer.queryable) {
          layers.push(ogcLayer.name);
        }
      }
    }

    let wfsFormat = null;
    if (this.supportsWFS && layers.length) {
      let format = undefined;
      if (this.wfsOutputFormat_ === WFSOutputFormat.GML3) {
        format = new olFormatGML3();
      } else if (this.wfsOutputFormat_ === WFSOutputFormat.GML2) {
        format = new olFormatGML2();
      }
      googAsserts.assert(format);
      wfsFormat = new olFormatWFS({
        featureNS: this.wfsFeatureNS,
        featureType: layers,
        gmlFormat: format
      });
    }

    /**
     * @type {?import("ol/format/WFS.js").default}
     * @private
     */
    this.wfsFormat_ = wfsFormat;

    let wmsFormat = null;
    if (this.supportsWMS && layers.length) {
      if (this.wmsInfoFormat === WMSInfoFormat.GML) {
        wmsFormat = new olFormatWMSGetFeatureInfo({
          layers
        });
      }
      // Todo, support more formats for WMS
    }

    /**
     * @type {?import("ol/format/WMSGetFeatureInfo.js").default}
     * @private
     */
    this.wmsFormat_ = wmsFormat;
  }

  // ========================================
  // === Dynamic property getters/setters ===
  // ========================================
  /**
   * @return {?Dimensions} Current dimensions to use for this data source
   * @export
   */
  get dimensions() {
    return this.dimensions_;
  }

  /**
   * @return {?TimeRange} Time range value
   * @export
   */
  get timeRangeValue() {
    let range = null;
    const lower = this.timeLowerValue;
    const upper = this.timeUpperValue;
    if (lower !== undefined) {
      range = {
        end: upper,
        start: lower
      };
    }
    return range;
  }

  /**
   * @param {?TimeRange} range Time range value
   * @export
   */
  set timeRangeValue(range) {
    if (range) {
      this.timeUpperValue = range.end;
      this.timeLowerValue = range.start;
    } else {
      this.timeUpperValue = undefined;
      this.timeLowerValue = undefined;
    }
  }

  // =======================================
  // === Static property getters/setters ===
  // =======================================

  /**
   * @inheritDoc
   */
  getAttributes() {
    return super.attributes;
  }

  /**
   * @inheritDoc
   */
  setAttributes(attributes) {
    super.setAttributes(attributes);
    this.updateGeometryNameFromAttributes_();
  }

  /**
   * @return {boolean} Copyable
   * @export
   */
  get copyable() {
    return this.copyable_;
  }

  /**
   * @return {string} Geometry name
   * @export
   */
  get geometryName() {
    return this.geometryName_;
  }

  /**
   * @return {string} OGC image type
   * @export
   */
  get ogcImageType() {
    return this.ogcImageType_;
  }

  /**
   * @return {?Array.<!OGCLayer>} OGC layers
   * @export
   */
  get ogcLayers() {
    return this.ogcLayers_;
  }

  /**
   * @return {string} OGC server type
   * @export
   */
  get ogcServerType() {
    return this.ogcServerType_;
  }

  /**
   * @return {string} OGC type
   * @export
   */
  get ogcType() {
    return this.ogcType_;
  }

  /**
   * @return {boolean} Snappable
   * @export
   */
  get snappable() {
    return this.snappable_;
  }

  /**
   * @return {boolean} Snapping to edges
   * @export
   */
  get snappingToEdges() {
    return this.snappingToEdges_;
  }

  /**
   * @return {boolean} Snapping to vertices
   * @export
   */
  get snappingToVertice() {
    return this.snappingToVertice_;
  }

  /**
   * @return {number} Snapping tolerance
   * @export
   */
  get snappingTolerance() {
    return this.snappingTolerance_;
  }

  /**
   * @return {string|undefined} Time attribute name
   * @export
   */
  get timeAttributeName() {
    return this.timeAttributeName_;
  }

  /**
   * @return {?TimeProperty} Time property
   * @export
   */
  get timeProperty() {
    return this.timeProperty_;
  }

  /**
   * @return {string} WFS feature namespace
   * @export
   */
  get wfsFeatureNS() {
    return this.wfsFeatureNS_;
  }

  /**
   * @return {string} WFS feature prefix
   * @export
   */
  get wfsFeaturePrefix() {
    return this.wfsFeaturePrefix_;
  }

  /**
   * @return {string} WFS output format
   * @export
   */
  get wfsOutputFormat() {
    return this.wfsOutputFormat_;
  }

  /**
   * @export
   * @return {string|undefined} WFS url
   */
  get wfsUrl() {
    return this.wfsUrl_;
  }

  /**
   * @return {string} WMS info format
   * @export
   */
  get wmsInfoFormat() {
    return this.wmsInfoFormat_;
  }

  /**
   * @return {boolean} WMS is single tile
   * @export
   */
  get wmsIsSingleTile() {
    return this.wmsIsSingleTile_;
  }

  /**
   * @return {string|undefined} WMS url
   * @export
   * @override
   */
  get wmsUrl() {
    return this.wmsUrl_;
  }

  /**
   * @return {string|undefined} WMTS layer
   * @export
   */
  get wmtsLayer() {
    return this.wmtsLayer_;
  }

  /**
   * @return {string|undefined} WMTS url
   * @export
   * @override
   */
  get wmtsUrl() {
    return this.wmtsUrl_;
  }

  // ===================================
  // === Calculated property getters ===
  // ===================================

  /**
   * @return {!DimensionsActive} Active dimensions
   * @export
   */
  get activeDimensions() {
    const active = {};
    const dimensions = this.dimensions_ || {};
    const config = this.dimensionsConfig || {};

    for (const key in config) {
      if (config[key] === null) {
        if (dimensions[key] !== undefined && dimensions[key] !== null) {
          active[key] = dimensions[key];
        }
      } else {
        active[key] = config[key];
      }
    }

    return active;
  }

  /**
   * A data source can't be combined to other data source to issue a single
   * WFS request if:
   *
   * - it has filter rules set
   * - it has time range set
   *
   * @return {boolean} Whether the data source can be combined to an other
   *     data source to fetch features in a single WFS request.
   * @export
   * @override
   */
  get combinableForWFS() {
    return this.filterRules === null && this.timeRangeValue === null;
  }

  /**
   * A data source can't be combined to other data source to issue a single
   * WMS request if:
   *
   * - it has filter rules set
   * - it has time range set
   *
   * @return {boolean} Whether the data source can be combined to an other
   *     data source to fetch features in a single WMS request.
   * @export
   * @override
   */
  get combinableForWMS() {
    return this.filterRules === null && this.timeRangeValue === null;
  }

  /**
   * Whether the data source is queryable or not. For an OGC data source to be
   * queryable, it requires the support of WFS or WMS and at least one ogc
   * layer to be querable.
   * @export
   */
  get queryable() {
    let queryable = false;
    const supportsOGCQueries = this.supportsWMS || this.supportsWFS;
    if (supportsOGCQueries && this.ogcLayers) {
      for (const ogcLayer of this.ogcLayers) {
        if (ogcLayer.queryable === true) {
          queryable = true;
          break;
        }
      }
    }
    return queryable;
  }

  /**
   * @return {boolean} Whether the data source supports making WFS requests
   *     or not.
   * @export
   * @override
   */
  get supportsWFS() {
    return this.wfsUrl !== undefined;
  }

  /**
   * To be able to do advanced operations on a data source, such as editing
   * or filtering, a data source must be bound to 1 set of attributes.
   * These attributes are the ones defined by an ogcLayer.  This means that
   * to be considered to support having attributes defined, you either need
   * to define them directly when creating the data source, or if you let
   * the querent service get them for you using a WFS DescribeFeatureType
   * request, the data source must have only 1 ogcLayer set, which must
   * be queryable.
   * @return {boolean} Supports attributes.
   * @export
   */
  get supportsAttributes() {
    return this.attributes !== null || (
      this.supportsWFS &&
      this.ogcLayers !== null &&
      this.ogcLayers.length === 1 &&
      this.ogcLayers[0].queryable === true
    );
  }

  /**
   * @return {boolean} Whether the data source supports making WMS requests
   *     or not.
   * @export
   * @override
   */
  get supportsWMS() {
    return this.wmsUrl !== undefined;
  }

  /**
   * @return {boolean} Whether the data source supports making WTMS requests
   *     or not.
   * @export
   */
  get supportsWMTS() {
    return this.wmtsUrl !== undefined;
  }

  /**
   * @return {?import("ol/format/WFS.js").default} WFS format.
   * @export
   */
  get wfsFormat() {
    return this.wfsFormat_;
  }

  /**
   * @return {?import("ol/format/WMSGetFeatureInfo.js").default} WMS format.
   * @export
   */
  get wmsFormat() {
    return this.wmsFormat_;
  }

  // ============================
  // === Other public methods ===
  // ============================

  /**
   * @param {OGC} dataSource Data source.
   * @return {boolean} Whether this data source can be combined to the given
   *     other data source to fetch features in a single WFS request.
   * @export
   * @override
   */
  combinableWithDataSourceForWFS(dataSource) {
    return this.combinableForWFS && dataSource.combinableForWFS &&
      this.supportsWFS && dataSource.supportsWFS &&
      this.queryable && dataSource.queryable &&
      this.wfsUrl === dataSource.wfsUrl &&
      this.haveTheSameActiveDimensions(dataSource);
  }

  /**
   * @param {OGC} dataSource Data source.
   * @return {boolean} Whether this data source can be combined to the given
   *     other data source to fetch features in a single WMS request.
   * @export
   * @override
   */
  combinableWithDataSourceForWMS(dataSource) {
    return this.combinableForWMS && dataSource.combinableForWMS &&
      this.supportsWMS && dataSource.supportsWMS &&
      this.queryable && dataSource.queryable &&
      this.wmsUrl === dataSource.wmsUrl &&
      this.haveTheSameActiveDimensions(dataSource);
  }

  /**
   * Check if there's at least one OGC layer in range of a given resolution.
   * @param {number} res Resolution.
   * @param {boolean} queryableOnly Whether to additionally check if the
   *     OGC layer is queryable as well or not. Defaults to `false`.
   * @return {boolean} At least one OGC layer is in range.
   * @export
   */
  isAnyOGCLayerInRange(res, queryableOnly = false) {
    return !!(this.getInRangeOGCLayerNames(res, queryableOnly).length);
  }

  /**
   * Returns a list of OGC layer names that are in range of a given resolution.
   * If there's no OGC layers defined, an empty array is returned.
   * @param {number} res Resolution.
   * @param {boolean} queryableOnly Whether to additionally check if the
   *     OGC layer is queryable as well or not. Defaults to `false`.
   * @return {Array.<string>} The OGC layer names that are in range.
   * @export
   */
  getInRangeOGCLayerNames(res, queryableOnly = false) {

    const layerNames = [];

    if (this.ogcLayers) {
      for (const ogcLayer of this.ogcLayers) {
        const maxRes = ogcLayer.maxResolution;
        const minRes = ogcLayer.minResolution;
        const inMinRange = minRes === undefined || res >= minRes;
        const inMaxRange = maxRes === undefined || res <= maxRes;
        const inRange = inMinRange && inMaxRange;

        if (inRange && (!queryableOnly || ogcLayer.queryable)) {
          layerNames.push(ogcLayer.name);
        }
      }
    }

    return layerNames;
  }

  /**
   * Returns the list of OGC layer names.
   * @param {boolean} queryableOnly Whether to additionally check if the
   *     OGC layer is queryable as well or not. Defaults to `false`.
   * @return {Array.<string>} The OGC layer names.
   * @export
   */
  getOGCLayerNames(queryableOnly = false) {

    const layerNames = [];

    if (this.ogcLayers) {
      for (const ogcLayer of this.ogcLayers) {
        if (!queryableOnly || ogcLayer.queryable) {
          layerNames.push(ogcLayer.name);
        }
      }
    }

    return layerNames;
  }

  /**
   * Returns the filtrable OGC layer name. This methods asserts that
   * the name exists and is filtrable.
   * @return {string} OGC layer name.
   * @export
   */
  getFiltrableOGCLayerName() {
    googAsserts.assert(this.filtrable);
    const layerNames = this.getOGCLayerNames();
    googAsserts.assert(layerNames.length === 1);
    return layerNames[0];
  }

  /**
   * Loop in the attributes of the data source. Update the `geometryName`
   * property on the first geometry attribute found. If none is found, then
   * the default geometry name is set.
   * @private
   */
  updateGeometryNameFromAttributes_() {
    let geometryName = DEFAULT_GEOMETRY_NAME;

    if (this.attributes) {
      for (const attribute of this.attributes) {
        if (attribute.type === ngeoFormatAttributeType.GEOMETRY) {
          geometryName = attribute.name;
          break;
        }
      }
    }

    this.geometryName_ = geometryName;
  }

  /**
   * @param {!OGC} dataSource Remote data source to
   *     compare with this one.
   * @return {boolean} Whether the two data sources have the same active
   *     dimensions. If both have no dimensions, they are considered to be
   *     sharing the same dimensions.
   * @export
   * @override
   */
  haveTheSameActiveDimensions(dataSource) {
    let share = true;

    const myActive = this.activeDimensions;
    const itsActive = dataSource.activeDimensions;

    for (const key in myActive) {
      if (myActive[key] !== itsActive[key]) {
        share = false;
        break;
      }
    }

    if (share) {
      for (const key in itsActive) {
        if (itsActive[key] !== myActive[key]) {
          share = false;
          break;
        }
      }
    }

    return share;
  }
}


/**
 * Guess the type of OGC service from a given url. Default returned value is
 * WMS.
 * @param {string} url Url
 * @return {string} Guessed OGC service type.
 */
export function guessServiceTypeByUrl(url) {
  let type;

  if (/(wmts)/i.test(url)) {
    type = Type.WMTS;
  } else {
    type = Type.WMS;
  }

  return type;
}


/**
 * Enum for the time property widget
 * Type of the widget to use
 * @enum {string}
 */
export const TimePropertyWidgetEnum = {
  SLIDER: 'slider',
  DATEPICKER: 'datepicker'
};

/**
 * Mode of the widget
 * @enum {string}
 */
export const TimePropertyModeEnum = {
  RANGE: 'range',
  VALUE: 'value',
  DISABLED: 'disabled'
};

/**
 * resolution of the widget
 * @enum {string}
 */
export const TimePropertyResolutionEnum = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
  SECOND: 'second'
};
