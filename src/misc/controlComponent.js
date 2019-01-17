/**
 * @module ngeo.misc.controlComponent
 */
import angular from 'angular';
import googAsserts from 'goog/asserts.js';
import olMap from 'ol/Map.js';
import olControlControl from 'ol/control/Control.js';

/**
 * @type {!angular.IModule}
 */
const exports = angular.module('ngeoControl', []);


/**
 * Provides a directive that can be used to add a control to the map
 * using a DOM element.
 *
 * Example:
 *
 *     <div ngeo-control="ctrl.control" ngeo-control-map="ctrl.map"></div>
 *
 * The expression passed to "ngeo-control" should evaluate to a control
 * instance, and the expression passed to "ngeo-control-map" should
 * evaluate to a map instance.
 *
 * See our live example: [../examples/control.html](../examples/control.html)
 *
 * @htmlAttribute {import("ol/Map.js").default} ngeo-control-map The map.
 * @return {angular.IDirective} The directive specs.
 * @ngInject
 * @ngdoc directive
 * @ngname ngeoControl
 */
function component() {
  return {
    restrict: 'A',
    /**
     * @param {angular.IScope} scope Scope.
     * @param {angular.JQLite} element Element.
     * @param {angular.Attributes} attrs Attributes.
     */
    link: (scope, element, attrs) => {

      const control = /** @type {import("ol/control/Contrimport("ol/js.js").default").default} */
              (scope.$eval(attrs['ngeoControl']));
      googAsserts.assertInstanceof(control, olControlControl);

      const map = /** @type {import("ol/Map.js").default} */
              (scope.$eval(attrs['ngeoControlMap']));
      googAsserts.assertInstanceof(map, olMap);

      control.setTarget(element[0]);
      map.addControl(control);
    }
  };
}


exports.directive('ngeoControl', component);


export default exports;
