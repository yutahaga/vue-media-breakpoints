"use strict";
/**
 * Used to detect browser support for adding an event listener with options
 * Credit: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportsCaptureOption = (() => {
    let test = false;
    try {
        const opts = Object.defineProperty({}, 'capture', {
            get() {
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
exports.createSafetyEventListenerOptions = (options) => {
    return !exports.supportsCaptureOption && typeof options === 'object'
        ? options.capture
        : options;
};
/**
 * Helper to add an event listener with an options object in supported browsers
 */
exports.addEventListenerWithOptions = (target, type, listener, options) => {
    target.addEventListener(type, listener, exports.createSafetyEventListenerOptions(options));
};
/**
 * Helper to remove an event listener with an options object in supported browsers
 */
exports.removeEventListenerWithOptions = (target, type, listener, options) => {
    target.removeEventListener(type, listener, exports.createSafetyEventListenerOptions(options));
};
