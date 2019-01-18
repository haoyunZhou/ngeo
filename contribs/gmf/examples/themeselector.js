/**
 */

import angular from 'angular';
import appURL from './url.js';
import './themeselector.css';
import gmfThemeModule from 'gmf/theme/module.js';

import gmfLayertreeTreeManager from 'gmf/layertree/TreeManager.js';

/** @type {!angular.IModule} **/
const module = angular.module('gmfapp', [
  'gettext',
  gmfLayertreeTreeManager.name,
  gmfThemeModule.name,
]);

module.value('gmfTreeUrl', appURL.GMF_THEMES);

module.constant('angularLocaleScript', '../build/angular-locale_{{locale}}.js');


/**
 * @constructor
 * @param {angular.IHttpService} $http Angular's $http service.
 * @param {import("gmf/theme/Themes.js").default} gmfThemes Themes service.
 * @param {import("gmf/theme/Manager.js").default} gmfThemeManager gmf Tree Manager service.
 * @ngInject
 */
exports.MainController = function($http, gmfThemes, gmfThemeManager) {

  /**
   * @param {gmfThemes.GmfTheme} theme Theme.
   * @return {boolean} Theme is 'Enseignement'
   * @export
   */
  this.filter = function(theme) {
    return theme.name !== 'Enseignement';
  };

  /**
   * @type {import("gmf/theme/Manager.js").default}
   * @export
   */
  this.manager = gmfThemeManager;

  gmfThemes.loadThemes();
};


module.controller('MainController', exports.MainController);


export default module;
