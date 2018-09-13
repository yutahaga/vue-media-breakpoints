import Vue from 'vue';
import { addEventListenerWithOptions } from './listener';

let _Vue: typeof Vue; // tslint:disable-line variable-name

export interface BreakPointsOption {
  [key: string]: number;
}

export interface BreakPoint<T extends BreakPointsOption> {
  name: keyof T;
  width: T[keyof T];
}

export type BreakPointListener<K> = <T extends BreakPointsOption>(
  breakPoint: BreakPoint<T>
) => any;

export interface BreakPointManagerOptions<T> {
  breakPoints: T;
  debounceFunction?: <K extends BreakPointListener<T>>(
    listener: K,
    interval: number
  ) => K;
  debounceInterval?: number;
}

export class BreakPointManager<T extends BreakPointsOption> {
  private vm!: Vue & { $data: BreakPoint<T> };
  private bpKeys: Array<keyof T>;

  constructor(private options: BreakPointManagerOptions<T>) {
    this.bpKeys = Object.keys(this.options.breakPoints).sort((a, b) => {
      if (this.options.breakPoints[a] < this.options.breakPoints[b]) {
        return -1;
      }
      if (this.options.breakPoints[a] > this.options.breakPoints[b]) {
        return 1;
      }
      return 0;
    }) as Array<keyof T>;
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

  private setBreakPoint(bp: BreakPoint<T>): void {
    this.vm.$data.name = bp.name;
    this.vm.$data.width = bp.width;
  }

  private setupVM(): void {
    this.vm = new _Vue({
      data: { name: '', width: -1 }
    }) as Vue & { $data: BreakPoint<T> };
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

    const newBreakPoint = (this.bpKeys.reduce(
      (acc: BreakPoint<T>, name, index) => {
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
    ) as any) as BreakPoint<T>;

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

export type PluginOptions<T> = BreakPointManagerOptions<T>;

export function install<T extends BreakPointsOption>(
  InjectedVue: typeof Vue,
  options: PluginOptions<T>
): void {
  if (process.env.NODE_ENV !== 'production' && _Vue) {
    throw new Error(
      '[vue-media-breakpoints] Vue Media Break-Points is already installed'
    );
  }

  _Vue = InjectedVue;

  const bpm = new BreakPointManager<T>(options);

  _Vue.mixin({
    beforeCreate(this: Vue): void {
      type Component = Vue & {
        $bp: BreakPointManager<T>;
        $parent: Component;
      };
      const vm = this as Component;

      vm.$bp = bpm;
    }
  });
}
