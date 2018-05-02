/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"layerorder": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([20,"commons"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/layerorder.css":
/*!*********************************!*\
  !*** ./examples/layerorder.css ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./examples/layerorder.js":
/*!********************************!*\
  !*** ./examples/layerorder.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _layerorder_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layerorder.css */ "./examples/layerorder.css");
/* harmony import */ var _layerorder_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_layerorder_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angular */ "./node_modules/angular/index.js-exposed");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ngeo_map_module_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngeo/map/module.js */ "./src/map/module.js");
/* harmony import */ var ngeo_misc_sortableComponent_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngeo/misc/sortableComponent.js */ "./src/misc/sortableComponent.js");
/* harmony import */ var ngeo_misc_syncArrays_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngeo/misc/syncArrays.js */ "./src/misc/syncArrays.js");
/* harmony import */ var ngeo_source_AsitVD_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngeo/source/AsitVD.js */ "./src/source/AsitVD.js");
/* harmony import */ var _geoblocks_proj_src_EPSG_21781_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @geoblocks/proj/src/EPSG_21781.js */ "./node_modules/@geoblocks/proj/src/EPSG_21781.js");
/* harmony import */ var ol_Map_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ol/Map.js */ "./node_modules/ol/Map.js");
/* harmony import */ var ol_View_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ol/View.js */ "./node_modules/ol/View.js");
/* harmony import */ var ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ol/layer/Tile.js */ "./node_modules/ol/layer/Tile.js");
/* harmony import */ var ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ol/source/TileWMS.js */ "./node_modules/ol/source/TileWMS.js");
MainController.$inject = ["$scope"];











var module = angular__WEBPACK_IMPORTED_MODULE_1___default.a.module('app', ['gettext', ngeo_map_module_js__WEBPACK_IMPORTED_MODULE_2__["default"].name, ngeo_misc_sortableComponent_js__WEBPACK_IMPORTED_MODULE_3__["default"].name]);

function MainController($scope) {
  var asitvd = new ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_9__["default"]({
    source: new ngeo_source_AsitVD_js__WEBPACK_IMPORTED_MODULE_5__["default"]({
      layer: 'asitvd.fond_couleur'
    })
  });
  asitvd.set('name', 'asitvd');
  var boundaries = new ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_9__["default"]({
    source: new ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_10__["default"]({
      url: 'https://wms.geo.admin.ch',
      params: {
        'LAYERS': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'
      },
      serverType: 'mapserver'
    })
  });
  boundaries.set('name', 'Boundaries');
  var waterBodies = new ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_9__["default"]({
    source: new ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_10__["default"]({
      url: 'https://wms.geo.admin.ch',
      params: {
        'LAYERS': 'ch.swisstopo.geologie-gravimetrischer_atlas'
      },
      serverType: 'mapserver'
    })
  });
  waterBodies.set('name', 'Water bodies');
  var cities = new ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_9__["default"]({
    source: new ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_10__["default"]({
      url: 'https://wms.geo.admin.ch',
      params: {
        'LAYERS': 'ch.swisstopo.dreiecksvermaschung'
      },
      serverType: 'mapserver'
    })
  });
  cities.set('name', 'Cities');
  this.map = new ol_Map_js__WEBPACK_IMPORTED_MODULE_7__["default"]({
    layers: [asitvd, boundaries, waterBodies, cities],
    view: new ol_View_js__WEBPACK_IMPORTED_MODULE_8__["default"]({
      projection: _geoblocks_proj_src_EPSG_21781_js__WEBPACK_IMPORTED_MODULE_6__["default"],
      resolutions: [1000, 500, 200, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5],
      center: [600000, 200000],
      zoom: 1
    })
  });
  var map = this.map;
  this.roads_ = new ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_9__["default"]({
    source: new ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_10__["default"]({
      url: 'https://wms.geo.admin.ch',
      params: {
        'LAYERS': 'ch.bafu.laerm-strassenlaerm_tag'
      },
      serverType: 'mapserver'
    })
  });
  this.roads_.set('name', 'Roads');
  this.selectedLayers = [];
  var selectedLayers = this.selectedLayers;
  Object(ngeo_misc_syncArrays_js__WEBPACK_IMPORTED_MODULE_4__["default"])(map.getLayers().getArray(), selectedLayers, true, $scope, layerFilter);
  $scope.$watchCollection(function () {
    return selectedLayers;
  }, function () {
    map.render();
  });

  function layerFilter(layer) {
    return layer !== asitvd;
  }
}

MainController.prototype.toggleRoadsLayer = function (val) {
  if (val === undefined) {
    return this.map.getLayers().getArray().indexOf(this.roads_) >= 0;
  } else {
    if (val) {
      this.map.addLayer(this.roads_);
    } else {
      this.map.removeLayer(this.roads_);
    }
  }
};

module.controller('MainController', MainController);
/* harmony default export */ __webpack_exports__["default"] = (module);

/***/ }),

/***/ "./src/misc/syncArrays.js":
/*!********************************!*\
  !*** ./src/misc/syncArrays.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function syncArrays(arr1, arr2, reverse, scope, filter) {
  var dereg1 = scope.$watchCollection(function () {
    return arr1;
  }, function () {
    var i, ii, j;

    if (reverse) {
      for (i = arr1.length - 1, j = 0; i >= 0; --i) {
        if (filter(arr1[i])) {
          arr2[j++] = arr1[i];
        }
      }
    } else {
      for (i = 0, ii = arr1.length, j = 0; i < ii; ++i) {
        if (filter(arr1[i])) {
          arr2[j++] = arr1[i];
        }
      }
    }

    arr2.length = j;
  });
  var dereg2 = scope.$watchCollection(function () {
    return arr2;
  }, function () {
    var i, ii, j;

    if (reverse) {
      for (i = 0, ii = arr1.length, j = arr2.length - 1; i < ii; ++i) {
        if (filter(arr1[i])) {
          arr1[i] = arr2[j--];
        }
      }

      console.assert(j == -1);
    } else {
      for (i = 0, ii = arr1.length, j = 0; i < ii; ++i) {
        if (filter(arr1[i])) {
          arr1[i] = arr2[j++];
        }
      }

      console.assert(j == arr2.length);
    }
  });
  return function () {
    dereg1();
    dereg2();
  };
}

/* harmony default export */ __webpack_exports__["default"] = (syncArrays);

/***/ }),

/***/ 20:
/*!*******************************************************************************************!*\
  !*** multi ./examples/common_dependencies.js ngeo/mainmodule.js ./examples/layerorder.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./examples/common_dependencies.js */"./examples/common_dependencies.js");
__webpack_require__(/*! ngeo/mainmodule.js */"./src/mainmodule.js");
module.exports = __webpack_require__(/*! ./examples/layerorder.js */"./examples/layerorder.js");


/***/ })

/******/ });
//# sourceMappingURL=layerorder.js.map