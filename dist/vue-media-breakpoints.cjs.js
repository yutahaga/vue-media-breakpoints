/*!
 * Vue Media Break-Points v0.1.1
 * https://github.com/yutahaga/vue-media-breakpoints
 *
 * @license
 * Copyright (c) 2018 undefined
 * Released under the MIT license
 * https://github.com/yutahaga/vue-media-breakpoints/blob/master/LICENSE
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Used to detect browser support for adding an event listener with options
 * Credit: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */
var supportsCaptureOption = (function () {
    var test = false;
    try {
        var opts = Object.defineProperty({}, 'capture', {
            get: function () {
                test = true;
            }
        });
        window.addEventListener('test', null, opts);
    }
    catch (e) { } /* tslint:disable-line no-empty */
    return test;
})();
/**
 * Helper to create a safety event listener options
 *
 */
var createSafetyEventListenerOptions = function (options) {
    return !supportsCaptureOption && typeof options === 'object'
        ? options.capture
        : options;
};
/**
 * Helper to add an event listener with an options object in supported browsers
 */
var addEventListenerWithOptions = function (target, type, listener, options) {
    target.addEventListener(type, listener, createSafetyEventListenerOptions(options));
};
/**
 * Helper to remove an event listener with an options object in supported browsers
 */
var removeEventListenerWithOptions = function (target, type, listener, options) {
    target.removeEventListener(type, listener, createSafetyEventListenerOptions(options));
};

var _Vue; // tslint:disable-line variable-name
var BreakPointManager = /** @class */ (function () {
    function BreakPointManager(options) {
        var _this = this;
        this.options = options;
        this.bpKeys = Object.keys(this.options.breakPoints).sort(function (a, b) {
            if (_this.options.breakPoints[a] < _this.options.breakPoints[b]) {
                return -1;
            }
            if (_this.options.breakPoints[a] > _this.options.breakPoints[b]) {
                return 1;
            }
            return 0;
        });
        this.setupVM();
        this.setupEventListener();
        this.updateBreakPoint();
    }
    Object.defineProperty(BreakPointManager.prototype, "name", {
        get: function () {
            return this.vm.$data.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BreakPointManager.prototype, "width", {
        get: function () {
            return this.vm.$data.width;
        },
        enumerable: true,
        configurable: true
    });
    BreakPointManager.prototype.above = function (bp) {
        return this.width > this.options.breakPoints[bp];
    };
    BreakPointManager.prototype.below = function (bp) {
        return this.width < this.options.breakPoints[bp];
    };
    BreakPointManager.prototype.equal = function (bp) {
        var _this = this;
        if (Array.isArray(bp)) {
            return bp.some(function (a) { return _this.width === _this.options.breakPoints[a]; });
        }
        return this.width === this.options.breakPoints[bp];
    };
    BreakPointManager.prototype.setBreakPoint = function (bp) {
        this.vm.$data.name = bp.name;
        this.vm.$data.width = bp.width;
    };
    BreakPointManager.prototype.setupVM = function () {
        this.vm = new _Vue({
            data: { name: '', width: -1 }
        });
    };
    BreakPointManager.prototype.setupEventListener = function () {
        if (typeof document === 'undefined') {
            return;
        }
        var callback = this.options.debounceFunction
            ? this.options.debounceFunction(this.updateBreakPoint, this.options.debounceInterval || 16)
            : this.updateBreakPoint;
        addEventListenerWithOptions(window, 'resize', callback.bind(this));
    };
    BreakPointManager.prototype.updateBreakPoint = function () {
        var _this = this;
        var clientWidth = getClientWidth();
        var newBreakPoint = this.bpKeys.reduce(function (acc, name, index) {
            var bpWidth = _this.options.breakPoints[name];
            if (bpWidth < clientWidth) {
                return {
                    name: name,
                    width: bpWidth
                };
            }
            return acc;
        }, { name: '', width: -1 });
        if (this.name !== newBreakPoint.name) {
            this.setBreakPoint(newBreakPoint);
        }
    };
    return BreakPointManager;
}());
function getClientWidth() {
    if (typeof document === 'undefined') {
        return 0;
    }
    return Math.max(document.documentElement ? document.documentElement.clientWidth : 0, window.innerWidth || 0);
}
function install(InjectedVue, options) {
    if (process.env.NODE_ENV !== 'production' && _Vue) {
        throw new Error('[vue-media-breakpoints] Vue Media Break-Points is already installed');
    }
    _Vue = InjectedVue;
    var bpm = new BreakPointManager(options);
    _Vue.mixin({
        beforeCreate: function () {
            var vm = this;
            vm.$bp = bpm;
        }
    });
}

exports.BreakPointManager = BreakPointManager;
exports.getClientWidth = getClientWidth;
exports.install = install;
exports.addEventListenerWithOptions = addEventListenerWithOptions;
exports.createSafetyEventListenerOptions = createSafetyEventListenerOptions;
exports.removeEventListenerWithOptions = removeEventListenerWithOptions;
exports.supportsCaptureOption = supportsCaptureOption;
