/**
 * Used to detect browser support for adding an event listener with options
 * Credit: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */

export const supportsCaptureOption = (() => {
  let test = false;

  try {
    const opts = Object.defineProperty({}, 'capture', {
      get() {
        test = true;
      }
    });
    window.addEventListener('test', null as any, opts);
  } catch (e) {} /* tslint:disable-line no-empty */

  return test;
})();

/**
 * Helper to create a safety event listener options
 *
 */
export const createSafetyEventListenerOptions = (
  options?: boolean | AddEventListenerOptions
) => {
  return !supportsCaptureOption && typeof options === 'object'
    ? options.capture
    : options;
};

/**
 * Helper to add an event listener with an options object in supported browsers
 */
export const addEventListenerWithOptions = (
  target: Window | Element,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) => {
  target.addEventListener(
    type,
    listener,
    createSafetyEventListenerOptions(options)
  );
};

/**
 * Helper to remove an event listener with an options object in supported browsers
 */
export const removeEventListenerWithOptions = (
  target: Element,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) => {
  target.removeEventListener(
    type,
    listener,
    createSafetyEventListenerOptions(options)
  );
};
