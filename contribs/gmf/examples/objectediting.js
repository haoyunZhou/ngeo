/**
 */

import angular from 'angular';
import appURL from './url.js';
import './objectediting.css';
import gmfLayertreeComponent from 'gmf/layertree/component.js';

import gmfLayertreeTreeManager from 'gmf/layertree/TreeManager.js';

import gmfMapComponent from 'gmf/map/component.js';

import gmfObjecteditingComponent from 'gmf/objectediting/component.js';

import gmfObjecteditingManager from 'gmf/objectediting/Manager.js';
import gmfThemeThemes from 'gmf/theme/Themes.js';
import ngeoMiscToolActivate from 'ngeo/misc/ToolActivate.js';
import ngeoMiscToolActivateMgr from 'ngeo/misc/ToolActivateMgr.js';
import EPSG21781 from '@geoblocks/proj/src/EPSG_21781.js';
import * as olProj from 'ol/proj.js';
import olCollection from 'ol/Collection.js';
import olMap from 'ol/Map.js';
import olView from 'ol/View.js';
import olLayerTile from 'ol/layer/Tile.js';
import olLayerVector from 'ol/layer/Vector.js';
import olSourceOSM from 'ol/source/OSM.js';
import olSourceVector from 'ol/source/Vector.js';


/** @type {!angular.IModule} **/
const module = angular.module('gmfapp', [
  'gettext',
  gmfLayertreeComponent.name,
  gmfLayertreeTreeManager.name,
  gmfMapComponent.name,
  gmfObjecteditingComponent.name,
  gmfObjecteditingManager.name,
  gmfThemeThemes.name,
  ngeoMiscToolActivateMgr.name,
]);

module.constant('defaultTheme', 'ObjectEditing');
module.constant('gmfLayersUrl', appURL.GMF_LAYERS);
module.constant('gmfTreeUrl', appURL.GMF_THEMES);
module.constant('gmfObjectEditingToolsOptions', {
  regularPolygonRadius: 150
});
module.constant('angularLocaleScript', '../build/angular-locale_{{locale}}.js');


/**
 * @param {import("gmf/objectediting/Manager.js").default} gmfObjectEditingManager The gmf
 *     ObjectEditing manager service.
 * @param {import("gmf/theme/Themes.js").default} gmfThemes The gmf themes service.
 * @param {import("gmf/layertree/TreeManager.js").default} gmfTreeManager gmf Tree Manager service.
 * @param {import("ngeo/misc/ToolActivateMgr.js").default} ngeoToolActivateMgr Ngeo ToolActivate manager
 *     service.
 * @constructor
 * @ngInject
 */
function MainController(gmfObjectEditingManager, gmfThemes,
  gmfTreeManager, ngeoToolActivateMgr) {

  /**
   * @type {import("gmf/layertree/TreeManager.js").default}
   * @private
   */
  this.gmfTreeManager_ = gmfTreeManager;

  gmfThemes.loadThemes();

  const projection = olProj.get(EPSG21781);
  projection.setExtent([485869.5728, 76443.1884, 837076.5648, 299941.7864]);

  /**
   * @type {import("ol/source/Vector.js").default}
   * @private
   */
  this.vectorSource_ = new olSourceVector({
    wrapX: false
  });

  /**
   * @type {import("ol/layer/Vector.js").default}
   * @private
   */
  this.vectorLayer_ = new olLayerVector({
    source: this.vectorSource_
  });

  /**
   * @type {import("ol/Collection.js").default.<import("ol/Feature.js").default>}
   * @export
   */
  this.sketchFeatures = new olCollection();

  /**
   * @type {import("ol/layer/Vector.js").default}
   * @private
   */
  this.sketchLayer_ = new olLayerVector({
    source: new olSourceVector({
      features: this.sketchFeatures,
      wrapX: false
    })
  });

  /**
   * @type {import("ol/Map.js").default}
   * @export
   */
  this.map = new olMap({
    layers: [
      new olLayerTile({
        source: new olSourceOSM()
      })
    ],
    view: new olView({
      projection: EPSG21781,
      resolutions: [200, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5],
      center: [537635, 152640],
      zoom: 2
    })
  });

  gmfThemes.getThemesObject().then((themes) => {
    if (themes) {
      // Add layer vector after
      this.map.addLayer(this.vectorLayer_);
      this.map.addLayer(this.sketchLayer_);
    }
  });

  /**
   * @type {string|undefined}
   * @export
   */
  this.objectEditingGeomType = gmfObjectEditingManager.getGeomType();

  /**
   * @type {number|undefined}
   * @export
   */
  this.objectEditingLayerNodeId = gmfObjectEditingManager.getLayerNodeId();

  /**
   * @type {boolean}
   * @export
   */
  this.objectEditingActive = true;

  const objectEditingToolActivate = new ngeoMiscToolActivate(
    this, 'objectEditingActive');
  ngeoToolActivateMgr.registerTool(
    'mapTools', objectEditingToolActivate, true);

  /**
   * @type {boolean}
   * @export
   */
  this.dummyActive = false;

  const dummyToolActivate = new ngeoMiscToolActivate(
    this, 'dummyActive');
  ngeoToolActivateMgr.registerTool(
    'mapTools', dummyToolActivate, false);

  /**
   * @type {?import("ol/Feature.js").default}
   * @export
   */
  this.objectEditingFeature = null;

  gmfObjectEditingManager.getFeature().then((feature) => {
    this.objectEditingFeature = feature;
    if (feature) {
      this.vectorSource_.addFeature(feature);
    }
  });

}

module.controller('MainController', MainController);


export default module;
