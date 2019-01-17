/**
 * @module ngeo.datasource.File
 */
import ngeoDatasourceDataSource from 'ngeo/datasource/DataSource.js';
import olCollection from 'ol/Collection.js';
import olLayerVector from 'ol/layer/Vector.js';
import olSourceVector from 'ol/source/Vector.js';


/**
 * The options required to create a `File`.
 *
 * features: Collection of `ol.Feature` objects.
 *
 * @typedef {{
 *   features: (ol.Collection.<!ol.Feature>|undefined)
 * }} FileOptions
 * @extends DataSourceOptions
 */

export default class extends ngeoDatasourceDataSource {

  /**
   * A data source that contains vector features that were loaded from a file.
   *
   * @param {FileOptions} options Options.
   */
  constructor(options) {

    super(options);


    // === STATIC properties (i.e. that never change) ===

    /**
     * @type {!ol.Collection.<!ol.Feature>}
     * @private
     */
    this.featuresCollection_ = options.features || new olCollection();

    /**
     * @type {!import("ol/source/Vector.js").default}
     * @private
     */
    this.source_ = new olSourceVector({
      features: this.featuresCollection_,
      wrapX: false
    });

    /**
     * @type {!import("ol/layer/Vector.js").default}
     * @private
     */
    this.layer_ = new olLayerVector({
      source: this.source_
    });
  }


  // ========================================
  // === Dynamic property getters/setters ===
  // ========================================

  /**
   * @return {!Array.<!ol.Feature>} Features
   * @export
   */
  get features() {
    return this.featuresCollection_.getArray();
  }


  // =======================================
  // === Static property getters/setters ===
  // =======================================

  /**
   * @return {!ol.Collection.<!ol.Feature>} Features collection
   * @export
   */
  get featuresCollection() {
    return this.featuresCollection_;
  }

  /**
   * @return {!import("ol/layer/Vector.js").default} Vector layer.
   * @export
   */
  get layer() {
    return this.layer_;
  }


  // ===================================
  // === Calculated property getters ===
  // ===================================

  /**
   * @return {import("ol/Extent.js").default} Extent.
   * @export
   */
  get extent() {
    return this.source_.getExtent();
  }
}
