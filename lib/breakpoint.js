var _Vue; // tslint:disable-line variable-name
var isServer = typeof window === 'undefined';
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
    BreakPointManager.prototype.above = function (bp, ssrFallback) {
        if (ssrFallback === void 0) { ssrFallback = false; }
        if (isServer) {
            return ssrFallback;
        }
        return this.width > this.options.breakPoints[bp];
    };
    BreakPointManager.prototype.orAbove = function (bp, ssrFallback) {
        if (ssrFallback === void 0) { ssrFallback = false; }
        if (isServer) {
            return ssrFallback;
        }
        return this.width >= this.options.breakPoints[bp];
    };
    BreakPointManager.prototype.below = function (bp, ssrFallback) {
        if (ssrFallback === void 0) { ssrFallback = false; }
        if (isServer) {
            return ssrFallback;
        }
        return this.width < this.options.breakPoints[bp];
    };
    BreakPointManager.prototype.orBelow = function (bp, ssrFallback) {
        if (ssrFallback === void 0) { ssrFallback = false; }
        if (isServer) {
            return ssrFallback;
        }
        return this.width <= this.options.breakPoints[bp];
    };
    BreakPointManager.prototype.equal = function (bp, ssrFallback) {
        var _this = this;
        if (ssrFallback === void 0) { ssrFallback = false; }
        if (isServer) {
            return ssrFallback;
        }
        if (Array.isArray(bp)) {
            return bp.some(function (a) { return _this.width === _this.options.breakPoints[a]; });
        }
        return this.width === this.options.breakPoints[bp];
    };
    BreakPointManager.prototype.between = function (bp1, bp2, ssrFallback) {
        if (ssrFallback === void 0) { ssrFallback = false; }
        if (isServer) {
            return ssrFallback;
        }
        return (this.options.breakPoints[bp1] <= this.width &&
            this.width < this.options.breakPoints[bp2]);
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
        if (isServer) {
            return;
        }
        var callback = this.options.debounceFunction
            ? this.options.debounceFunction(this.updateBreakPoint, this.options.debounceInterval || 16)
            : this.updateBreakPoint;
        window.addEventListener('resize', callback.bind(this), { passive: true });
    };
    BreakPointManager.prototype.updateBreakPoint = function () {
        var _this = this;
        var clientWidth = getClientWidth();
        var newBreakPoint = this.bpKeys.reduce(function (acc, name, index) {
            var bpWidth = _this.options.breakPoints[name];
            if (bpWidth <= clientWidth) {
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
export { BreakPointManager };
export function getClientWidth() {
    if (typeof document === 'undefined') {
        return 0;
    }
    return Math.max(document.documentElement ? document.documentElement.clientWidth : 0, window.innerWidth || 0);
}
export function install(InjectedVue, options) {
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
