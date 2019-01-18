/**
 */
import angular from 'angular';
import gmfObjecteditingComponent from 'gmf/objectediting/component.js';
import gmfObjecteditingGetWMSFeatureComponent from 'gmf/objectediting/getWMSFeatureComponent.js';
import gmfObjecteditingManager from 'gmf/objectediting/Manager.js';
import gmfObjecteditingQuery from 'gmf/objectediting/Query.js';
import gmfObjecteditingToolsComponent from 'gmf/objectediting/toolsComponent.js';

/**
 * @type {!angular.IModule}
 */
export default angular.module('gmfObjecteditingModule', [
  gmfObjecteditingComponent.name,
  gmfObjecteditingGetWMSFeatureComponent.name,
  gmfObjecteditingManager.name,
  gmfObjecteditingQuery.name,
  gmfObjecteditingToolsComponent.name,
]);
