import Vue from 'vue';
export interface BreakPointsOption {
    [key: string]: number;
}
export interface BreakPoint<T extends BreakPointsOption> {
    name: keyof T;
    width: T[keyof T];
}
export declare type BreakPointListener<K> = <T extends BreakPointsOption>(breakPoint: BreakPoint<T>) => any;
export interface BreakPointManagerOptions<T> {
    breakPoints: T;
    debounceFunction?: <K extends BreakPointListener<T>>(listener: K, interval: number) => K;
    debounceInterval?: number;
}
export declare class BreakPointManager<T extends BreakPointsOption> {
    private options;
    private vm;
    private bpKeys;
    constructor(options: BreakPointManagerOptions<T>);
    readonly name: keyof T;
    readonly width: T[keyof T];
    above(bp: keyof T, ssrFallback?: boolean): boolean;
    below(bp: keyof T, ssrFallback?: boolean): boolean;
    equal(bp: keyof T | Array<keyof T>, ssrFallback?: boolean): boolean;
    private setBreakPoint;
    private setupVM;
    private setupEventListener;
    private updateBreakPoint;
}
export declare function getClientWidth(): number;
export declare type PluginOptions<T> = BreakPointManagerOptions<T>;
export declare function install<T extends BreakPointsOption>(InjectedVue: typeof Vue, options: PluginOptions<T>): void;
