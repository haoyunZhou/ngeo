/**
 * This file provides the "app" namespace, which is the
 * application's main namespace. And it defines the application's Angular
 * module.
 */

import angular from 'angular';
import ngeoUtils from 'ngeo/utils.js';

/**
 * @type {!angular.IModule}
 */
const module = angular.module('app', []);

module.config(['$compileProvider', function($compileProvider) {
  if (!('debug' in ngeoUtils.decodeQueryString(window.location.search))) {
    // Disable the debug info
    $compileProvider.debugInfoEnabled(false);
  }
}]);


export default module;
