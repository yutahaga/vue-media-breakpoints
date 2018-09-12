import Vue from 'vue';
import { addEventListenerWithOptions } from './listener';

let _Vue: typeof Vue; // tslint:disable-line variable-name

export interface BreakPointsOption {
  [key: string]: number;
}

export interface BreakPoint {
  name: string | null;
  width: number;
}

export type BreakPointListener = (breakPoint: BreakPoint) => any;

export interface BreakPointManagerOptions {
  breakPoints: BreakPointsOption;
  debounceFunction?: <T extends BreakPointListener>(
    listener: T,
    interval: number
  ) => T;
  debounceInterval?: number;
}

export class BreakPointManager {
  private vm!: Vue & { $data: BreakPoint };
  private bpKeys: string[];

  constructor(private options: BreakPointManagerOptions) {
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

  public get name() {
    return this.vm.$data.name;
  }

  public get width() {
    return this.vm.$data.width;
  }

  private setBreakPoint(bp: BreakPoint): void {
    this.vm.$data.name = bp.name;
    this.vm.$data.width = bp.width;
  }

  private setupVM(): void {
    this.vm = new _Vue({
      data: { name: '', width: -1 }
    });
  }

  private setupEventListener(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const callback = this.options.debounceFunction
      ? this.options.debounceFunction(
          this.updateBreakPoint,
          this.options.debounceInterval || 16
        )
      : this.updateBreakPoint;

    addEventListenerWithOptions(window, 'resize', callback.bind(this));
  }

  private updateBreakPoint(): void {
    const clientWidth = getClientWidth();

    const newBreakPoint = this.bpKeys.reduce(
      (acc: BreakPoint, name, index) => {
        const bpWidth = this.options.breakPoints[name];

        if (bpWidth < clientWidth) {
          return {
            name,
            width: bpWidth
          };
        }

        return acc;
      },
      { name: '', width: -1 }
    );

    if (this.name !== newBreakPoint.name) {
      this.setBreakPoint(newBreakPoint);
    }
  }
}

export function getClientWidth() {
  if (typeof document === 'undefined') {
    return 0;
  }

  return Math.max(
    document.documentElement ? document.documentElement.clientWidth : 0,
    window.innerWidth || 0
  );
}

export type PluginOptions = BreakPointManagerOptions;

export function install(InjectedVue: typeof Vue, options: PluginOptions): void {
  if (process.env.NODE_ENV !== 'production' && _Vue) {
    throw new Error(
      '[vue-media-breakpoints] Vue Media Break-Points is already installed'
    );
  }

  _Vue = InjectedVue;

  const bpm = new BreakPointManager(options);

  _Vue.mixin({
    beforeCreate(this: Vue): void {
      type Component = Vue & {
        $bp: InstanceType<typeof BreakPointManager>;
        $parent: Component;
      };
      const vm = this as Component;

      vm.$bp = bpm;
    }
  });
}
