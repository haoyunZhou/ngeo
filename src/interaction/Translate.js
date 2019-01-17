/**
 * @module ngeo.interaction.Translate
 */
import googAsserts from 'goog/asserts.js';
import {
  getUid as olUtilGetUid,
  inherits as olUtilInherits
} from 'ol/util.js';
import * as olExtent from 'ol/extent.js';
import olFeature from 'ol/Feature.js';
import * as olEvents from 'ol/events.js';
import olGeomGeometry from 'ol/geom/Geometry.js';
import olGeomLineString from 'ol/geom/LineString.js';
import olGeomPoint from 'ol/geom/Point.js';
import olGeomPolygon from 'ol/geom/Polygon.js';
import olInteractionTranslate from 'ol/interaction/Translate.js';
import olLayerVector from 'ol/layer/Vector.js';
import olSourceVector from 'ol/source/Vector.js';


/**
 * features: Only features contained in this collection will be able to be translated. If
 * not specified, all features on the map will be able to be translated.
 *
 * style: Style for the center features added by the translate interaction to
 * to show that features can be moved.
 *
 * @typedef {{
 *     features: (ol.Collection.<ol.Feature>|undefined),
 *     style: (ol.style.Style|Array.<ol.style.Style>|ol.StyleFunction|undefined)
 * }} TranslateOptions
 */


/**
 * An extension of the OpenLayers Translate interaction that adds the following
 * features to it:
 *
 * - show a small arrow icon in the middle of the features allowing a visual
 *   aspect that tells the user "this feature can be moved"
 * - pressing the ESC key automatically deactivate the interaction.
 *
 * @constructor
 * @extends {import("ol/interaction/Translate.js").default}
 * @param {TranslateOptions} options Options.
 */
const exports = function(options) {

  /**
   * @type {!Array.<ol.EventsKey>}
   * @private
   */
  this.listenerKeys_ = [];

  /**
   * @type {!Object.<number, ol.EventsKey>}
   * @private
   */
  this.featureListenerKeys_ = {};

  /**
   * @type {?ol.EventsKey}
   * @private
   */
  this.keyPressListenerKey_ = null;

  /**
   * @type {ol.Collection.<ol.Feature>}
   * @private
   */
  this.myFeatures_ = options.features !== undefined ? options.features : null;

  /**
   * @type {import("ol/source/Vector.js").default}
   * @private
   */
  this.vectorSource_ = new olSourceVector({
    useSpatialIndex: false
  });

  /**
   * @type {import("ol/layer/Vector.js").default}
   * @private
   */
  this.vectorLayer_ = new olLayerVector({
    source: this.vectorSource_,
    style: options.style,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  });

  /**
   * @type {!Object.<number, ol.Feature>}
   * @private
   */
  this.centerFeatures_ = {};

  olInteractionTranslate.call(
    this, /** @type {olx.interaction.TranslateOptions} */ (options));
};

olUtilInherits(exports, olInteractionTranslate);


/**
 * Activate or deactivate the interaction.
 * @param {boolean} active Active.
 * @override
 */
exports.prototype.setActive = function(active) {

  if (this.keyPressListenerKey_) {
    olEvents.unlistenByKey(this.keyPressListenerKey_);
    this.keyPressListenerKey_ = null;
  }

  olInteractionTranslate.prototype.setActive.call(this, active);

  if (active) {
    this.keyPressListenerKey_ = olEvents.listen(
      document,
      'keyup',
      this.handleKeyUp_,
      this
    );
  }

  this.setState_();
};


/**
 * Remove the interaction from its current map and attach it to the new map.
 * Subclasses may set up event handlers to get notified about changes to
 * the map here.
 * @param {import("ol/PluggableMap.js").default} map Map.
 * @override
 */
exports.prototype.setMap = function(map) {

  const currentMap = this.getMap();
  if (currentMap) {
    this.vectorLayer_.setMap(null);
  }

  olInteractionTranslate.prototype.setMap.call(this, map);

  if (map) {
    this.vectorLayer_.setMap(map);
  }

  this.setState_();
};


/**
 * @private
 */
exports.prototype.setState_ = function() {
  const map = this.getMap();
  const active = this.getActive();
  const features = this.myFeatures_;
  const keys = this.listenerKeys_;

  if (map && active && features) {
    features.forEach(feature => this.addFeature_(feature));
    keys.push(
      olEvents.listen(features, 'add', this.handleFeaturesAdd_, this),
      olEvents.listen(features, 'remove', this.handleFeaturesRemove_, this)
    );
  } else {

    if (map) {
      const elem = map.getTargetElement();
      elem.style.cursor = 'default';
    }

    keys.forEach(olEvents.unlistenByKey);
    keys.length = 0;
    features.forEach(feature => this.removeFeature_(feature));
  }
};


/**
 * @param {import("ol/Collection/Event.js").default} evt Event.
 * @private
 */
exports.prototype.handleFeaturesAdd_ = function(evt) {
  const feature = evt.element;
  googAsserts.assertInstanceof(feature, olFeature,
    'feature should be an ol.Feature');
  this.addFeature_(feature);
};


/**
 * @param {import("ol/Collection/Event.js").default} evt Event.
 * @private
 */
exports.prototype.handleFeaturesRemove_ = function(evt) {
  const feature = /** @type {import("ol/Feature.js").default} */ (evt.element);
  this.removeFeature_(feature);
};


/**
 * @param {import("ol/Feature.js").default} feature Feature.
 * @private
 */
exports.prototype.addFeature_ = function(feature) {
  const uid = olUtilGetUid(feature);
  const geometry = feature.getGeometry();
  googAsserts.assertInstanceof(geometry, olGeomGeometry);

  this.featureListenerKeys_[uid] = olEvents.listen(
    geometry,
    'change',
    this.handleGeometryChange_.bind(this, feature),
    this
  );

  const point = this.getGeometryCenterPoint_(geometry);
  const centerFeature = new olFeature(point);
  this.centerFeatures_[uid] = centerFeature;
  this.vectorSource_.addFeature(centerFeature);
};


/**
 * @param {import("ol/Feature.js").default} feature Feature.
 * @private
 */
exports.prototype.removeFeature_ = function(feature) {
  const uid = olUtilGetUid(feature);
  if (this.featureListenerKeys_[uid]) {
    olEvents.unlistenByKey(this.featureListenerKeys_[uid]);
    delete this.featureListenerKeys_[uid];

    this.vectorSource_.removeFeature(this.centerFeatures_[uid]);
    delete this.centerFeatures_[uid];
  }
};


/**
 * @param {import("ol/Feature.js").default} feature Feature being moved.
 * @param {import("ol/events/Event.js").default} evt Event.
 * @private
 */
exports.prototype.handleGeometryChange_ = function(feature,
  evt) {
  const geometry = evt.target;
  googAsserts.assertInstanceof(geometry, olGeomGeometry);

  const point = this.getGeometryCenterPoint_(geometry);
  const uid = olUtilGetUid(feature);
  this.centerFeatures_[uid].setGeometry(point);
};


/**
 * @param {import("ol/geom/Geometry.js").default} geometry Geometry.
 * @return {import("ol/geom/Point.js").default} The center point of the geometry.
 * @private
 */
exports.prototype.getGeometryCenterPoint_ = function(
  geometry) {

  let center;
  let point;

  if (geometry instanceof olGeomPolygon) {
    point = geometry.getInteriorPoint();
  } else if (geometry instanceof olGeomLineString) {
    center = geometry.getCoordinateAt(0.5);
  } else {
    const extent = geometry.getExtent();
    center = olExtent.getCenter(extent);
  }

  if (!point && center) {
    point = new olGeomPoint(center);
  }

  googAsserts.assert(point, 'Point should be thruthy');

  return point;
};


/**
 * Deactivate this interaction if the ESC key is pressed.
 * @param {KeyboardEvent} evt Event.
 * @private
 */
exports.prototype.handleKeyUp_ = function(evt) {
  // 27 == ESC key
  if (evt.keyCode === 27) {
    this.setActive(false);
  }
};


export default exports;
