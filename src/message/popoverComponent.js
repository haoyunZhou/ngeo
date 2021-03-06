/**
 */
import angular from 'angular';
import 'bootstrap/js/src/tooltip.js';
import 'bootstrap/js/src/popover.js';

/**
 * @type {angular.IModule}
 */
const module = angular.module('ngeoPopover', []);


/**
 * Provides a directive used to display a Bootstrap popover.
 *
 *<div ngeo-popover>
 *  <a ngeo-popover-anchor class="btn btn-info">anchor 1</a>
 *  <div ngeo-popover-content>
 *    <ul>
 *      <li>action 1:
 *        <input type="range"/>
 *      </li>
 *    </ul>
 *  </div>
 *</div>
 * @ngdoc directive
 * @ngInject
 * @ngname ngeoPopover
 * @return {angular.IDirective} The Directive Definition Object.
 */
function component() {
  return {
    restrict: 'A',
    scope: true,
    controller: 'NgeoPopoverController as popoverCtrl',
    link: (scope, elem, attrs, ngeoPopoverCtrl) => {

      ngeoPopoverCtrl.anchorElm.on('inserted.bs.popover', () => {
        ngeoPopoverCtrl.bodyElm.show();
        ngeoPopoverCtrl.shown = true;
      });

      ngeoPopoverCtrl.anchorElm.popover({
        container: 'body',
        html: true,
        content: ngeoPopoverCtrl.bodyElm,
        boundary: 'viewport',
        placement: attrs['ngeoPopoverPlacement'] || 'right'
      });

      if (attrs['ngeoPopoverDismiss']) {
        $(attrs['ngeoPopoverDismiss']).on('scroll', () => {
          ngeoPopoverCtrl.dismissPopover();
        });
      }

      scope.$on('$destroy', () => {
        ngeoPopoverCtrl.anchorElm.popover('destroy');
        ngeoPopoverCtrl.anchorElm.unbind('inserted.bs.popover');
        ngeoPopoverCtrl.anchorElm.unbind('hidden.bs.popover');
      });
    }
  };
}

/**
 * @ngdoc directive
 * @ngInject
 * @ngname ngeoPopoverAnchor
 * @return {angular.IDirective} The Directive Definition Object
 */
function anchorComponent() {
  return {
    restrict: 'A',
    require: '^^ngeoPopover',
    link: (scope, elem, attrs, ngeoPopoverCtrl) => {
      ngeoPopoverCtrl.anchorElm = elem;
    }
  };
}

/**
 * @ngdoc directive
 * @ngInject
 * @ngname ngeoPopoverContent
 * @return {angular.IDirective} The Directive Definition Object
 */
function contentComponent() {
  return {
    restrict: 'A',
    require: '^^ngeoPopover',
    link: (scope, elem, attrs, ngeoPopoverCtrl) => {
      ngeoPopoverCtrl.bodyElm = elem;
      elem.hide();
    }
  };
}

/**
 * The controller for the 'popover' directive.
 * @constructor
 * @private
 * @ngInject
 * @ngdoc controller
 * @ngname NgeoPopoverController
 * @param {angular.IScope} $scope Scope.
 */
function PopoverController($scope) {
  /**
   * The state of the popover (displayed or not)
   * @type {boolean}
   * @export
   */
  this.shown = false;

  /**
   * @type {JQuery|undefined}
   * @export
   */
  this.anchorElm = undefined;

  /**
   * @type {JQuery|undefined}
   * @export
   */
  this.bodyElm = undefined;

  function onMouseDown(clickEvent) {
    if (this.anchorElm[0] !== clickEvent.target &&
      this.bodyElm.parent()[0] !== clickEvent.target &
      this.bodyElm.parent().find(clickEvent.target).length === 0 && this.shown) {
      this.dismissPopover();
    }
  }

  angular.element('body').on('mousedown', onMouseDown.bind(this));

  $scope.$on('$destroy', () => {
    angular.element('body').off('mousedown', onMouseDown);
  });
}


/**
 * Dissmiss popover function
 * @export
 */
PopoverController.prototype.dismissPopover = function() {
  this.shown = false;
  this.anchorElm.popover('hide');
};


module.controller('NgeoPopoverController', PopoverController);
module.directive('ngeoPopover', component);
module.directive('ngeoPopoverAnchor', anchorComponent);
module.directive('ngeoPopoverContent', contentComponent);


export default module;
