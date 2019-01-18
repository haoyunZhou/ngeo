/**
 */
import angular from 'angular';
import gmfObjecteditingQuery from 'gmf/objectediting/Query.js';
import * as olEvents from 'ol/events.js';

/**
 * @type {!angular.IModule}
 */
const exports = angular.module('gmfObjecteditingGetWMSFeatureComponent', [
  gmfObjecteditingQuery.name,
]);


/**
 * When activated, this directive registers clicks on an OL3 map and use the
 * clicked coordinate to fetch a feature using the ObjectEditing query service.
 * A feature returned is pushed to a collection.
 *
 * Example:
 *
 *     <gmf-objecteditinggetwmsfeature
 *         gmf-objecteditinggetwmsfeature-active="ctrl.active"
 *         gmf-objecteditinggetwmsfeature-features="ctrl.features"
 *         gmf-objecteditinggetwmsfeature-layerinfo="ctrl.layerInfo"
 *         gmf-objecteditinggetwmsfeature-map="::ctrl.map">
 *     </gmf-objecteditinggetwmsfeature>
 *
 * @htmlAttribute {boolean} gmf-objecteditinggetwmsfeature-active Whether the
 *     directive is active or not.
 * @htmlAttribute {import("ol/Collection.js").default} gmf-objecteditinggetwmsfeature-features
 *     The collection of features where to add those created by this directive.
 * @htmlAttribute {gmfx.ObjectEditingQueryableLayerInfo} gmf-objecteditinggetwmsfeature-layerinfo Queryable layer info.
 * @htmlAttribute {import("ol/Map.js").default} gmf-objecteditinggetwmsfeature-map The map.
 * @return {angular.IDirective} The directive specs.
 * @ngInject
 * @ngdoc directive
 * @ngname gmfObjecteditinggetwmsfeature
 */
function directive() {
  return {
    controller: 'gmfObjecteditinggetwmsfeatureController',
    scope: {
      'active': '=gmfObjecteditinggetwmsfeatureActive',
      'features': '<gmfObjecteditinggetwmsfeatureFeatures',
      'layerInfo': '=gmfObjecteditinggetwmsfeatureLayerinfo',
      'map': '<gmfObjecteditinggetwmsfeatureMap'
    },
    bindToController: true
  };
}

exports.directive('gmfObjecteditinggetwmsfeature', directive);


/**
 * @param {!angular.IScope} $scope Scope.
 * @param {import("gmf/objectediting/Query.js").default} gmfObjectEditingQuery GMF ObjectEditing
 *     query service.
 * @constructor
 * @private
 * @ngInject
 * @ngdoc controller
 * @ngname GmfObjecteditinggetwmsfeatureController
 */
function Controller($scope, gmfObjectEditingQuery) {

  // Scope properties

  /**
   * @type {boolean}
   * @export
   */
  this.active;

  $scope.$watch(
    () => this.active,
    this.handleActiveChange_.bind(this)
  );

  /**
   * @type {import("ol/Collection.js").default}
   * @export
   */
  this.features;

  /**
   * @type {gmfx.ObjectEditingQueryableLayerInfo}
   * @export
   */
  this.layerInfo;

  /**
   * @type {import("ol/Map.js").default}
   * @export
   */
  this.map;


  // Injected properties

  /**
   * @type {import("gmf/objectediting/Query.js").default}
   * @private
   */
  this.gmfObjectEditingQuery_ = gmfObjectEditingQuery;

}


/**
 * @param {boolean} active Active.
 * @private
 */
Controller.prototype.handleActiveChange_ = function(active) {
  if (active) {
    olEvents.listen(
      this.map,
      'click',
      this.handleMapClick_,
      this
    );
  } else {
    olEvents.unlisten(
      this.map,
      'click',
      this.handleMapClick_,
      this
    );
  }
};


/**
 * @param {import("ol/MapBrowserEvent.js").default} evt Event.
 * @private
 */
Controller.prototype.handleMapClick_ = function(evt) {
  this.gmfObjectEditingQuery_.getFeatureInfo(
    this.layerInfo,
    evt.coordinate,
    this.map
  ).then((feature) => {
    if (feature) {
      this.features.push(feature);
    }
  });
};

exports.controller('gmfObjecteditinggetwmsfeatureController', Controller);


export default module;
