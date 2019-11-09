/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./frontend/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./frontend/index.js":
/*!***************************!*\
  !*** ./frontend/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var client = feathers();\nclient.configure(feathers.rest(\"http://localhost:3030\").jquery(window.jQuery)).configure(feathers.authentication({\n  storage: window.localStorage\n}));\nvar graph = d3.select(\"#graph\");\nvar currentWork;\n\nvar makePanelHtml = function makePanelHtml(relation) {\n  var annotationDiv;\n\n  if (relation.annotation) {\n    annotationDiv = \"<div class='panel-footer'>\".concat(relation.annotation, \"</div>\");\n  } else {\n    annotationDiv = \"\";\n  } // prettier-ignore\n\n\n  var panelHtml = $(\"<div id=\\\"panel-\".concat(relation.work._id, \"\\\" class=\\\"panel panel-default result \").concat(relation.relation_type, \"\\\">\\n        <div class=\\\"panel-body\\\">\\n            <span class=\\\"type\\\">\").concat(relation.relation_type, \"</span>\\n            \").concat(jQuery(relation.work.htmlCitation).children().first().html(), \"\\n        </div>\\n        \").concat(annotationDiv, \"\\n      </div>\"));\n  return panelHtml;\n};\n\nvar focusOnWork = function focusOnWork(id) {\n  client.service(\"graphs\").get(id).then(function (data) {\n    currentWork = data.work; // Update graph\n\n    d3.select(\"#graph\").graphviz({\n      zoom: false\n    }).transition().renderDot(data.digraph, updateDOM); // Update current citation\n\n    $(\"#current-work-citation\").html(currentWork.htmlCitation); // Map related-to works to left-hand panels\n\n    $(\".results-list\").empty();\n    data.relationsTo.map(function (relation) {\n      var panelHtml = makePanelHtml(relation);\n      $(\".results-list\").append(panelHtml);\n      panelHtml.click(function (event) {\n        focusOnWork(event.currentTarget.id.slice(6));\n      });\n    }); // Automatically jump back to top of page\n\n    $(\"html, body\").animate({\n      scrollTop: 0\n    }, 60);\n  });\n};\n\nvar updateDOM = function updateDOM() {\n  d3.selectAll(\"g.node\").on(\"click\", function (instance) {\n    focusOnWork(instance.attributes.id.slice(5));\n  });\n}; // Select an arbitrary work to kick things off\n\n\nfocusOnWork(\"9XihvtxArmDbTwlK\");\n\n//# sourceURL=webpack:///./frontend/index.js?");

/***/ })

/******/ });