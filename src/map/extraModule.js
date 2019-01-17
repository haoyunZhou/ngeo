/**
 * @module import("ngeo/map/extraModule.js").default
 */
import angular from 'angular';
import ngeoMapLayerHelper from 'ngeo/map/LayerHelper.js';

/**
 * @type {!angular.IModule}
 */
export default angular.module('ngeoMapExtraModule', [
  ngeoMapLayerHelper.module.name,
]);
