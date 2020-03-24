import _ from 'lodash';

import {isWindowOverflowed} from './utils';


let freezeCount = 0;
const subscriptions = {};

/**
 * Computes only the *visible* width of scrollbars on the document. If the
 * scrollbars are not visible because the document is shorter than the window,
 * returns zero.
 */
export const computeVisibleScrollbarWidth = _.memoize(() => {
  if (!isWindowOverflowed()) {
    return 0;
  }

  const inner = document.createElement('p');
  inner.style.width = '100%';
  inner.style.height = '200px';

  const outer = document.createElement('div');
  outer.style.position = 'absolute';
  outer.style.top = '0px';
  outer.style.left = '0px';
  outer.style.visibility = 'hidden';
  outer.style.width = '200px';
  outer.style.height = '150px';
  outer.style.overflow = 'hidden';
  outer.appendChild(inner);

  document.body.appendChild(outer);
  const w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;
  if (w1 === w2) {
    w2 = outer.clientWidth;
  }

  document.body.removeChild(outer);

  return (w1 - w2);
}, () => {
  // This is the cache key resolver for memoize to ensure that we vary the
  // cache based on whether or not the window is overflowed as well as the zoom level.
  const ratio = Math.round(window.devicePixelRatio * 100);
  return ratio.toString() + isWindowOverflowed();
});


/**
 * Updates the styles to either freeze or unfreeze the page.
 *
 * Note: This is confirmed to work on Android. iPhone has yet to be sufficiently tested.
 *
 * @param {boolean} isFrozen
 * @private
 */
function updateStyle(isFrozen) {
  const htmlTag = document.getElementsByTagName('html')[0];
  const bodyTag = document.getElementsByTagName('body')[0];

  htmlTag.style.overflow = isFrozen ? 'hidden' : '';
  bodyTag.style.overflow = isFrozen ? 'hidden' : '';

  // Scroll bars are only hidden by default on OS X, iOS and maybe Android
  // with a touch-based scrolling device. If you have a mouse wheel or no
  // touch device, or are on Windows, you'll see a scroll bar, and without
  // this correction, a page with a visible scroll bar will jump when we
  // freeze it.
  if (bodyTag.clientHeight < bodyTag.scrollHeight || htmlTag.clientHeight < htmlTag.scrollHeight) {
    bodyTag.style.marginRight = isFrozen ? `${computeVisibleScrollbarWidth()}px` : '';
  } else {
    bodyTag.style.marginRight = '';
  }
}


/**
 * Freezes the page and keeps track of the how many times the freeze function has been called.
 * @private
 */
export function freeze() {
  updateStyle(true);
  freezeCount++;
  notifySubscribers();
}

/**
 * Unfreezes the page if all of the components that freezed the page have been removed.
 * @private
 */
export function unfreeze() {
  freezeCount--;

  if (!freezeCount) {
    updateStyle(false);
  }

  notifySubscribers();
}

function notifySubscribers() {
  _.forOwn(subscriptions, subscription => subscription(freezeCount));
}

/**
 * Subscribes a consumer to any change in the freeze count of the page
 * @param key A unique key identifying the subscriber
 * @param callback A callback that receives the *new* value of the freeze count as the first parameter
 */
export function subscribeToFreezeChange(key, callback) {
  if (__DEBUG__ && subscriptions[key]) {
    // eslint-disable-next-line no-console
    console.warn(`page-freeze: key ’${key}’ has already been used and will be overwritten.`);
  }
  subscriptions[key] = callback;
}

export function unsubscribeToFreezeChange(key) {
  delete subscriptions[key];
}
