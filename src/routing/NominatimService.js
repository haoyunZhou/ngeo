/**
 */
import angular from 'angular';
import ngeoMiscDebounce from 'ngeo/misc/debounce.js';


/**
 * @typedef {{
 *     name: (string),
 *     coordinate: (ol.Coordinate)
 * }} NominatimSearchResult
 */


/**
 * @typedef {{
 *     display_name: (string),
 *     lon: (number),
 *     lat: (number)
 * }} NominatimSearchResponseResult
 */


/**
 * Service to provide access to Nominatim, which allows to search for
 * OSM data by name and address.
 * @param {angular.IHttpService} $http Angular http service.
 * @param {angular.auto.IInjectorService} $injector Main injector.
 * @param {miscDebounce} ngeoDebounce ngeo Debounce service.
 * @constructor
 * @ngdoc service
 * @ngInject
 * @export
 * @ngname ngeoNominatimService
 * @see https://wiki.openstreetmap.org/wiki/Nominatim
 */
function NominatimService($http, $injector, ngeoDebounce) {

  /**
   * @type {angular.IHttpService}
   * @private
   */
  this.$http_ = $http;

  /**
   * @type {miscDebounce}
   * @private
   */
  this.ngeoDebounce_ = ngeoDebounce;

  /**
   * URL for Nominatim backend
   * Defaults openstreetmap instance.
   * @type {string}
   * @private
   */
  this.nominatimUrl_ = 'https://nominatim.openstreetmap.org/';

  if ($injector.has('ngeoNominatimUrl')) {
    this.nominatimUrl_ = $injector.get('ngeoNominatimUrl');

    // the url is expected to end with a slash
    if (this.nominatimUrl_.substr(-1) !== '/') {
      this.nominatimUrl_ += '/';
    }
  }

  /**
   * @type {Object<string, string>}
   * @private
   */
  this.searchDefaultParams_ = {};

  if ($injector.has('ngeoNominatimSearchDefaultParams')) {
    this.searchDefaultParams_ = $injector.get('ngeoNominatimSearchDefaultParams');
  }

  /**
   * Delay (in milliseconds) to avoid calling the API too often.
   * Only if there were no calls for that many milliseconds,
   * the last call will be executed.
   * @type {number}
   * @private
   */
  this.typeaheadDebounceDelay_ = 500;

  /**
   * @export
   * @type {function(string,function(Array.<BloodhoundDatum>),(function(Array.<import("ol/Feature.js").default>)|undefined))}
   */
  this.typeaheadSourceDebounced =
    /** @type{function(string,function(Array.<BloodhoundDatum>),(function(Array.<import("ol/Feature.js").default>)|undefined))} */
    (this.ngeoDebounce_(/** @type {function(?)} */ (this.typeaheadSource_.bind(this)), this.typeaheadDebounceDelay_, true));
};

/**
 * Search by name
 * @param {string} query Search query
 * @param {?Object} params Optional parameters
 * @return {!angular.IHttpPromise} promise of the Nominatim API request
 * @see https://wiki.openstreetmap.org/wiki/Nominatim#Search
 * @export
 */
NominatimService.prototype.search = function(query, params) {
  let url = `${this.nominatimUrl_}search?q=${query}`;

  params = params || {};
  params = Object.assign({}, this.searchDefaultParams_, params);

  // require JSON response
  params['format'] = 'json';

  if (params) {
    url += '&';
    const options = [];
    for (const option of Object.keys(params)) {
      options.push(`${option}=${params[option]}`);
    }
    url += options.join('&');
  }

  return this.$http_.get(url);
};

/**
 * Reverse Geocoding
 * @param {import("ol/coordinate.js").Coordinate} coordinate Search coordinate in LonLat projection
 * @param {(Object|undefined)} params Optional parameters
 * @return {!angular.IHttpPromise} promise of the Nominatim API request
 * @see https://wiki.openstreetmap.org/wiki/Nominatim#Reverse_Geocoding
 * @export
 */
NominatimService.prototype.reverse = function(coordinate, params) {
  let url = `${this.nominatimUrl_}reverse`;

  params = Object.assign({}, params);

  // coordinate
  params['lon'] = coordinate[0];
  params['lat'] = coordinate[1];

  // require JSON response
  params['format'] = 'json';

  if (params) {
    url += '?';
    const options = [];
    for (const option of Object.keys(params)) {
      options.push(`${option}=${params[option]}`);
    }
    url += options.join('&');
  }

  return this.$http_.get(url);
};

/**
 * @param {string} query Search query
 * @param {function(Array.<BloodhoundDatum>)} syncResults Callback for synchronous execution, unused
 * @param {function(Array.<NominatimSearchResult>)} asyncResults Callback for asynchronous execution
 * @private
 */
NominatimService.prototype.typeaheadSource_ = function(query, syncResults, asyncResults) {
  const onSuccess_ = function(resp) {
    /**
     * Parses result response.
     * @param {NominatimSearchResponseResult} result Result
     * @return {NominatimSearchResult} Parsed result
     */
    const parse = function(result) {
      return /** @type{NominatimSearchResult} */({
        coordinate: [result.lon, result.lat],
        name: result.display_name
      });
    };
    asyncResults(resp.data.map(parse));
  };

  const onError_ = function(resp) {
    asyncResults([]);
  };

  this.search(query, {}).then(onSuccess_, onError_);
};

/**
 * @type {!angular.IModule}
 */
const module = angular.module('ngeoNominatimService', [
  ngeoMiscDebounce.name
]);

module.service('ngeoNominatimService', exports);


export default module;
