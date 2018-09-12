"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listener_1 = require("./listener");
let _Vue; // tslint:disable-line variable-name
class BreakPointManager {
    constructor(options) {
        this.options = options;
        this.bpKeys = Object.keys(this.options.breakPoints).sort((a, b) => {
            if (this.options.breakPoints[a] < this.options.breakPoints[b]) {
                return -1;
            }
            if (this.options.breakPoints[a] > this.options.breakPoints[b]) {
                return 1;
            }
            return 0;
        });
        this.setupVM();
        this.setupEventListener();
        this.updateBreakPoint();
    }
    get name() {
        return this.vm.$data.name;
    }
    get width() {
        return this.vm.$data.width;
    }
    setBreakPoint(bp) {
        this.vm.$data.name = bp.name;
        this.vm.$data.width = bp.width;
    }
    setupVM() {
        this.vm = new _Vue({
            data: { name: '', width: -1 }
        });
    }
    setupEventListener() {
        if (typeof document === 'undefined') {
            return;
        }
        const callback = this.options.debounceFunction
            ? this.options.debounceFunction(this.updateBreakPoint, this.options.debounceInterval || 16)
            : this.updateBreakPoint;
        listener_1.addEventListenerWithOptions(window, 'resize', callback.bind(this));
    }
    updateBreakPoint() {
        const clientWidth = getClientWidth();
        const newBreakPoint = this.bpKeys.reduce((acc, name, index) => {
            const bpWidth = this.options.breakPoints[name];
            if (bpWidth < clientWidth) {
                return {
                    name,
                    width: bpWidth
                };
            }
            return acc;
        }, { name: '', width: -1 });
        if (this.name !== newBreakPoint.name) {
            this.setBreakPoint(newBreakPoint);
        }
    }
}
exports.BreakPointManager = BreakPointManager;
function getClientWidth() {
    if (typeof document === 'undefined') {
        return 0;
    }
    return Math.max(document.documentElement ? document.documentElement.clientWidth : 0, window.innerWidth || 0);
}
exports.getClientWidth = getClientWidth;
function install(InjectedVue, options) {
    if (process.env.NODE_ENV !== 'production' && _Vue) {
        throw new Error('[vue-media-breakpoints] Vue Media Break-Points is already installed');
    }
    _Vue = InjectedVue;
    const bpm = new BreakPointManager(options);
    _Vue.mixin({
        beforeCreate() {
            const vm = this;
            vm.$bp = bpm;
        }
    });
}
exports.install = install;
