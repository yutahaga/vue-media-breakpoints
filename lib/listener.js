/**
 * Used to detect browser support for adding an event listener with options
 * Credit: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */
export var supportsCaptureOption = (function () {
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
export var createSafetyEventListenerOptions = function (options) {
    return !supportsCaptureOption && typeof options === 'object'
        ? options.capture
        : options;
};
/**
 * Helper to add an event listener with an options object in supported browsers
 */
export var addEventListenerWithOptions = function (target, type, listener, options) {
    target.addEventListener(type, listener, createSafetyEventListenerOptions(options));
};
/**
 * Helper to remove an event listener with an options object in supported browsers
 */
export var removeEventListenerWithOptions = function (target, type, listener, options) {
    target.removeEventListener(type, listener, createSafetyEventListenerOptions(options));
};
