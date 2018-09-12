import Vue from 'vue';
export interface BreakPointsOption {
    [key: string]: number;
}
export interface BreakPoint {
    name: string | null;
    width: number;
}
export declare type BreakPointListener = (breakPoint: BreakPoint) => any;
export interface BreakPointManagerOptions {
    breakPoints: BreakPointsOption;
    debounceFunction?: <T extends BreakPointListener>(listener: T, interval: number) => T;
    debounceInterval?: number;
}
export declare class BreakPointManager {
    private options;
    private vm;
    private bpKeys;
    constructor(options: BreakPointManagerOptions);
    readonly name: string | null;
    readonly width: number;
    private setBreakPoint;
    private setupVM;
    private setupEventListener;
    private updateBreakPoint;
}
export declare function getClientWidth(): number;
export declare type PluginOptions = BreakPointManagerOptions;
export declare function install(InjectedVue: typeof Vue, options: PluginOptions): void;
