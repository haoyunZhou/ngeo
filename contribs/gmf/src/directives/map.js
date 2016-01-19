goog.provide('gmf.MapController');
goog.provide('gmf.mapDirective');

goog.require('gmf');
goog.require('gmf.Permalink');
goog.require('goog.asserts');
/**
 * This goog.require is needed because it provides 'ngeo-map' used in
 * the template.
 * @suppress {extraRequire}
 */
goog.require('ngeo.mapDirective');
goog.require('ol.Map');


/**
 * A "map" directive for a GeoMapFish application.
 *
 * @example
 * <gmf-map gmf-map-map="mainCtrl.map"></gmf-map>
 *
 * @return {angular.Directive} The Directive Definition Object.
 * @ngInject
 * @ngdoc directive
 * @ngname gmfMap
 */
gmf.mapDirective = function() {
  return {
    scope: {
      'getMapFn': '&gmfMapMap'
    },
    controller: 'GmfMapController',
    controllerAs: 'ctrl',
    template: '<div ngeo-map="ctrl.map"></div>'
  };
};

gmf.module.directive('gmfMap', gmf.mapDirective);


/**
 * @param {angular.Scope} $scope The directive's scope.
 * @param {gmf.Permalink} gmfPermalink The gmf permalink service.
 * @constructor
 * @ngInject
 * @ngdoc controller
 * @ngname GmfMapController
 */
gmf.MapController = function($scope, gmfPermalink) {

  var map = $scope['getMapFn']();
  goog.asserts.assertInstanceof(map, ol.Map);

  /**
   * @type {!ol.Map}
   * @export
   */
  this.map = map;

  gmfPermalink.setMap(this.map);

};

gmf.module.controller('GmfMapController', gmf.MapController);
