import angular from 'angular';
import ngeoDatasourceDataSources from 'ngeo/datasource/DataSources.js';
import {getUid as olUtilGetUid} from 'ol/util.js';

/**
 * @type {!angular.IModule}
 */
const module = angular.module('gmfLayertreeDatasourceGroupTreeComponent', [
  ngeoDatasourceDataSources.name,
]);


module.run(/* @ngInject */ ($templateCache) => {
  // @ts-ignore: webpack
  $templateCache.put('gmf/layertree/datasourceGroupTreeComponent', require('./datasourceGroupTreeComponent.html'));
});


module.value('gmfLayertreeDatasourceGroupTreeTemplateUrl',
  /**
   * @param {!angular.IAttributes} $attrs Attributes.
   * @return {string} The template url.
   */
  ($attrs) => {
    const templateUrl = $attrs['gmfLayertreeDatasourceGroupTreeTemplateUrl'];
    return templateUrl !== undefined ? templateUrl :
      'gmf/layertree/datasourceGroupTreeComponent';
  });


/**
 * @param {!angular.IAttributes} $attrs Attributes.
 * @param {!function(!angular.IAttributes): string} gmfLayertreeDatasourceGroupTreeTemplateUrl Template function.
 * @return {string} Template URL.
 * @ngInject
 */
function gmfLayertreeDatasourceGroupTreeTemplateUrl($attrs, gmfLayertreeDatasourceGroupTreeTemplateUrl) {
  return gmfLayertreeDatasourceGroupTreeTemplateUrl($attrs);
}

/**
 * @private
 */
class Controller {

  /**
   * @param {!angular.IScope} $scope Angular scope.
   * @param {!import("ngeo/datasource/DataSources.js").default} ngeoDataSources Ngeo data sources
   *     service.
   * @private
   * @ngInject
   * @ngdoc controller
   * @ngname GmfDatasourcegrouptreeController
   */
  constructor($scope, ngeoDataSources) {

    // Binding properties

    /**
     * @type {!import("ngeo/datasource/Group.js").default}
     * @export
     */
    this.group;


    // Injected properties

    /**
     * @type {!angular.IScope}
     * @private
     */
    this.scope_ = $scope;

    /**
     * @type {!DataSources}
     * @private
     */
    this.dataSources_ = ngeoDataSources.collection;
  }

  /**
   * @return {string} Group uid.
   * @export
   */
  getGroupUid() {
    return `datasourcegrouptree-${olUtilGetUid(this.group)}`;
  }

  /**
   * Toggle visibility of the group itself, i.e. its visibility state.
   * @export
   */
  toggle() {
    this.group.toggleVisibilityState();
  }

  /**
   * Toggle visible property of a data source.
   * @param {import("ngeo/datasource/DataSource.js").default} dataSource Data source to toggle the
   * visibility
   * @export
   */
  toggleDataSource(dataSource) {
    dataSource.visible = !dataSource.visible;
  }

  /**
   * Remove all data sources from the `ngeo.datasource.DataSources` collection, which
   * will automatically remove them from the Group. The group itself
   * is going to be removed as well, destroying this component in the process.
   * @export
   */
  remove() {
    for (let i = this.group.dataSources.length - 1, ii = 0; i >= ii; i--) {
      this.dataSources_.remove(this.group.dataSources[i]);
    }
  }

  /**
   * @param {!import("ngeo/datasource/DataSource.js").default} dataSource Data source to remove from
   *     the `ngeo.DataSources` collection.
   * @export
   */
  removeDataSource(dataSource) {
    this.dataSources_.remove(dataSource);
  }
}


module.component('gmfDatasourcegrouptree', {
  bindings: {
    'group': '<'
  },
  controller: Controller,
  templateUrl: gmfLayertreeDatasourceGroupTreeTemplateUrl
});


export default module;
