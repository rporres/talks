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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.sendLinkDetails = sendLinkDetails;
exports.goToLink = goToLink;
exports.default = setupLinkTracking;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-env browser */
/* global $ */
var SEND_COMMAND = 'send';
var EVENT_HIT_TYPE = 'event';
var EVENT_FIELDS = ['eventCategory', 'eventAction', 'eventLabel', 'eventValue', 'transport', 'hitCallback'];

/**
 * Compulsory fields for send event on clicking a link.
 */
function compulsoryFields() /* link */{
  return {
    transport: 'beacon'
  };
}

/**
 * Returns the URL origin given a string representation of it. If the browser
 * does not support URL, it returns href itself.
 *
 * @param {String} href the string containing the URL.
 * @return {String} the origin of the URL.
 */
function getOrigin(href) {
  if (URL !== undefined) {
    return new URL(href).origin;
  }

  return href;
}

/**
 * Computes the default values for some keys to the send event command.
 *
 * @param {HTMLAnchorElement} link anchor clicked.
 * @return {Object} object with the default values.
 */
function defaultsForLink(link) {
  var sameOrigin = getOrigin(link) === window.location.origin;
  return {
    eventCategory: sameOrigin ? 'inbound' : 'outbound',
    eventAction: 'click',
    eventLabel: link.href
  };
}

/**
 * Computes the data for a given anchor element
 *
 * @param {HTMLAnchorElement} link
 * @return {Object} object with the values to call ga send event command.
 */
function getData(link) {
  var data = Object.assign(defaultsForLink(link), link.dataset, compulsoryFields(link));

  return EVENT_FIELDS.reduce(function (memo, key) {
    /* eslint no-param-reassign: ["error", { "props": false }] */
    if (key in data) {
      memo[key] = data[key];
    }
    return memo;
  }, {});
}

/**
 * Returns the arguments to call ga command when the link has been clicked.
 *
 * @param {HTMLAnchorElement} link element to get the data from.
 * @return {Array<String, String, Object>} arguments for ga method.
 */
function commandArguments(link) {
  return [SEND_COMMAND, EVENT_HIT_TYPE, getData(link)];
}

var gaInternal = [];
var ga = window.ga || function () {
  var _console;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  gaInternal.push(args);
  (_console = console).log.apply(_console, args);

  var last = args.pop();

  if (typeof last.hitCallback === 'function') {
    setTimeout(last.hitCallback.bind(last), 0);
  }
};

/**
 * Promisify ga
 *
 * @param {...any} args
 * @return {Promise} a promise that resolves whenever the hitCallback is called.
 */
function gaPromise() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var obj = {};
  var oldCallback = function oldCallback() {};

  if (_typeof(args[args.length - 1]) === 'object') {
    obj = args.pop();
  }

  if (typeof obj.hitCallback === 'function') {
    oldCallback = obj.hitCallback;
  }

  return new Promise(function (resolve) {
    obj.hitCallback = function () {
      oldCallback.apply(undefined, arguments);
      resolve.apply(undefined, arguments);
    };
    ga.apply(undefined, args.concat([obj]));
  });
}

function isScrollableLink(link) {
  var _link$href$split = link.href.split('#'),
      _link$href$split2 = _slicedToArray(_link$href$split, 2),
      url = _link$href$split2[0],
      id = _link$href$split2[1];

  return window.location.href.indexOf(url) > 0 && id;
}

/**
 * Scrolls to element anchored by the given link.
 *
 * @param {HTMLAnchorElement} link
 */
function scrollTo(link) {
  var _link$href$split3 = link.href.split('#'),
      _link$href$split4 = _slicedToArray(_link$href$split3, 2),
      id = _link$href$split4[1];

  $('body, html').animate({
    scrollTop: $('#' + id).offset().top
  }, 1000);
}

/**
 * Sends to Google Analytics the details from the link
 *
 * @param {HTMLAnchorElement} link anchor clicked
 * @return {Promise} a promise resolved whenever hitCallback is called.
 */
function sendLinkDetails(link) {
  return gaPromise.apply(undefined, _toConsumableArray(commandArguments(link)));
}

/**
 * Emulates the click on the link.
 *
 * @param {HTMLAnchorElement} link anchor to emulate
 */
function goToLink(link) {
  if (link.target === '_blank') {
    window.open(link.href);
  } else {
    window.location.href = link.href;
  }
}

/**
 * Sets up the tracking of links, inbound and outbound.
 *
 * For a link to be tracked it needs to:
 *
 * 1. Have a `data-tracked` attribute.
 * 2. Have a non-empty `href` attribute.
 */
function setupLinkTracking() {
  document.addEventListener('click', function (evt) {
    var target = evt.target;

    if (!('tracked' in target.dataset) || !target.href) {
      return;
    }

    evt.preventDefault();

    if (isScrollableLink(target)) {
      sendLinkDetails(target);
      scrollTo(target);
    }

    sendLinkDetails(target).then(function () {
      return goToLink(target);
    });
  });
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _link_track = __webpack_require__(0);

var _link_track2 = _interopRequireDefault(_link_track);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.addEventListener('DOMContentLoaded', function () {
  return (0, _link_track2.default)();
});

/***/ })
/******/ ]);