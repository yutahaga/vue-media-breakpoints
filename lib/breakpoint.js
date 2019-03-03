let VueInstance = null;
const isServer = typeof window === 'undefined';
export class BreakPointManager {
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
    above(bp, ssrFallback = true) {
        if (isServer) {
            return ssrFallback;
        }
        return this.width > this.options.breakPoints[bp];
    }
    orAbove(bp, ssrFallback = true) {
        if (isServer) {
            return ssrFallback;
        }
        return this.width >= this.options.breakPoints[bp];
    }
    below(bp, ssrFallback = true) {
        if (isServer) {
            return ssrFallback;
        }
        return this.width < this.options.breakPoints[bp];
    }
    orBelow(bp, ssrFallback = true) {
        if (isServer) {
            return ssrFallback;
        }
        return this.width <= this.options.breakPoints[bp];
    }
    equal(bp, ssrFallback = true) {
        if (isServer) {
            return ssrFallback;
        }
        if (Array.isArray(bp)) {
            return bp.some(a => this.width === this.options.breakPoints[a]);
        }
        return this.width === this.options.breakPoints[bp];
    }
    between(bp1, bp2, ssrFallback = true) {
        if (isServer) {
            return ssrFallback;
        }
        return (this.options.breakPoints[bp1] <= this.width &&
            this.width < this.options.breakPoints[bp2]);
    }
    setBreakPoint(bp) {
        this.vm.$data.name = bp.name;
        this.vm.$data.width = bp.width;
    }
    setupVM() {
        if (!VueInstance)
            return;
        this.vm = new VueInstance({
            data: { name: '', width: -1 }
        });
    }
    setupEventListener() {
        if (isServer) {
            return;
        }
        const callback = this.options.debounceFunction
            ? this.options.debounceFunction(this.updateBreakPoint, this.options.debounceInterval || 16)
            : this.updateBreakPoint;
        window.addEventListener('resize', callback.bind(this), { passive: true });
    }
    updateBreakPoint() {
        const clientWidth = getClientWidth();
        const newBreakPoint = this.bpKeys.reduce((acc, name, index) => {
            const bpWidth = this.options.breakPoints[name];
            if (bpWidth <= clientWidth) {
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
export function getClientWidth() {
    if (typeof document === 'undefined') {
        return 0;
    }
    return Math.max(document.documentElement ? document.documentElement.clientWidth : 0, window.innerWidth || 0);
}
export function install(InjectedVue, options) {
    if (process.env.NODE_ENV !== 'production' && VueInstance) {
        throw new Error('[vue-media-breakpoints] Vue Media Break-Points is already installed');
    }
    VueInstance = InjectedVue;
    const bpm = new BreakPointManager(options);
    VueInstance.mixin({
        beforeCreate() {
            const vm = this;
            vm.$bp = bpm;
        }
    });
}
