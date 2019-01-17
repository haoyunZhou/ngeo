/**
 * @module import("ngeo/statemanager/extraModule.js").default
 */
import angular from 'angular';
import ngeoStatemanagerWfsPermalink from 'ngeo/statemanager/WfsPermalink.js';

/**
 * @type {!angular.IModule}
 */
export default angular.module('ngeoStatemanagerExtraModule', [
  ngeoStatemanagerWfsPermalink.module.name,
]);
