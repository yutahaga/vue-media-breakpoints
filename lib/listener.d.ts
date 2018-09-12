/**
 * Used to detect browser support for adding an event listener with options
 * Credit: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */
export declare const supportsCaptureOption: boolean;
/**
 * Helper to create a safety event listener options
 *
 */
export declare const createSafetyEventListenerOptions: (options?: boolean | AddEventListenerOptions | undefined) => boolean | AddEventListenerOptions | undefined;
/**
 * Helper to add an event listener with an options object in supported browsers
 */
export declare const addEventListenerWithOptions: (target: Element | Window, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) => void;
/**
 * Helper to remove an event listener with an options object in supported browsers
 */
export declare const removeEventListenerWithOptions: (target: Element, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) => void;
