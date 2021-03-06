import angular from 'angular';
import ngeoMiscFilters from 'ngeo/misc/filters.js';
import ngeoInteractionMeasureAreaMobile from 'ngeo/interaction/MeasureAreaMobile.js';
import {MeasueMobileBaseController} from 'gmf/mobile/measure/baseComponent.js';

const module = angular.module('gmfMobileMeasureArea', [
  ngeoMiscFilters.name,
]);


module.value('gmfMobileMeasureAreaTemplateUrl',
  /**
   * @param {JQuery} element Element.
   * @param {angular.IAttributes} attrs Attributes.
   * @return {string} The template url.
   */
  (element, attrs) => {
    const templateUrl = attrs['gmfMobileMeasureAreaTemplateurl'];
    return templateUrl !== undefined ? templateUrl :
      'gmf/measure/areaComponent';
  });

module.run(/* @ngInject */ ($templateCache) => {
  // @ts-ignore: webpack
  $templateCache.put('gmf/measure/areaComponent', require('./baseComponent.html'));
});


/**
 * Provide a directive to do a area measure on the mobile devices.
 *
 * Example:
 *
 *      <div gmf-mobile-measurearea
 *        gmf-mobile-measurearea-active="ctrl.measureAreaActive"
 *        gmf-mobile-measurearea-map="::ctrl.map">
 *      </div>
 *
 * @htmlAttribute {boolean} gmf-mobile-measurearea-active Used to active
 * or deactivate the component.
 * @htmlAttribute {number=} gmf-mobile-measurearea-precision the number of significant digits to display.
 * @htmlAttribute {import("ol/Map.js").default} gmf-mobile-measurearea-map The map.
 * @htmlAttribute {import("ol/style/Style.js").default|Array.<import("ol/style/Style.js").default>|import("ol/StyleFunction.js").default=}
 *     gmf-mobile-measurearea-sketchstyle A style for the measure area.
 * @param {string|function(!JQuery=, !angular.IAttributes=)}
 *     gmfMobileMeasureAreaTemplateUrl Template URL for the directive.
 * @return {angular.Directive} The Directive Definition Object.
 * @ngInject
 * @ngdoc directive
 * @ngname gmfMobileMeasureArea
 */
function component(gmfMobileMeasureAreaTemplateUrl) {
  return {
    restrict: 'A',
    scope: {
      'active': '=gmfMobileMeasureareaActive',
      'precision': '<?gmfMobileMeasureareaPrecision',
      'map': '=gmfMobileMeasureareaMap',
      'sketchStyle': '=?gmfMobileMeasureareaSketchstyle'
    },
    controller: 'GmfMobileMeasureAreaController as ctrl',
    bindToController: true,
    templateUrl: gmfMobileMeasureAreaTemplateUrl,
    /**
     * @param {angular.Scope} scope Scope.
     * @param {JQuery} element Element.
     * @param {angular.IAttributes} attrs Attributes.
     * @param {import("gmf/mobile/measure.js").default.areaComponent.Controller_} controller Controller.
     */
    link: (scope, element, attrs, controller) => {
      controller.init();
    }
  };
}


module.directive('gmfMobileMeasurearea', component);


class Controller extends MeasueMobileBaseController {
  /**
   * @param {!angular.Scope} $scope Angular scope.
   * @param {!angular.IFilterService} $filter Angular filter
   * @param {!angular.gettext.gettextCatalog} gettextCatalog Gettext catalog.
   * @ngInject
   */
  constructor($scope, $filter, gettextCatalog) {
    super($scope, $filter, gettextCatalog);

    /**
     * @type {import("ngeo/interaction/MeasureAreaMobile.js").default}
     */
    this.measure;
  }

  /**
   * Initialise the controller.
   */
  init() {
    this.measure = new ngeoInteractionMeasureAreaMobile(this.filter('ngeoUnitPrefix'), this.gettextCatalog, {
      precision: this.precision,
      sketchStyle: this.sketchStyle
    });

    super.init(this);
  }

  /**
   * Add current sketch point to line measure
   * @export
   */
  addPoint() {
    this.drawInteraction.addToDrawing();
  }

  /**
   * Clear the sketch feature
   * @export
   */
  clear() {
    this.drawInteraction.clearDrawing();
  }

  /**
   * Finish line measure
   * @export
   */
  finish() {
    this.drawInteraction.finishDrawing();
  }

  /**
   * Deactivate the directive.
   * @export
   */
  deactivate() {
    this.active = false;
  }
}

module.controller('GmfMobileMeasureAreaController', Controller);

export default module;
