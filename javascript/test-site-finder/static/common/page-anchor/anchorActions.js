import _ from 'lodash';
import scrollTo from 'scroll-to';


const SCROLL_DURATION = 500;
const SCROLL_ANIMATION_DISABLE_PERIOD = 600;

const anchors = {};
let animating = false;
let animationTimer = null;
let onAnchorDidMount = _.noop;
let headerOffset = 0;
const subscriptions = {};

// Optionally pass a list of anchor IDs to filter for determining the active anchor
function getActiveAnchorFromScrollPosition(includeAnchors) {
  // Avoid calculating the active anchor when scrolling so the underline doesn't jump around
  if (animating) {
    return null;
  }

  let closestAnchorId;
  let closestPosition;

  _.forOwn(anchors, (anchor, anchorId) => {
    if (includeAnchors && includeAnchors.indexOf(anchorId) === -1) {
      return;
    }

    const position = anchor.getBoundingClientRect().top;

    if (!closestAnchorId || (position <= 0 && position > closestPosition)) {
      closestAnchorId = anchorId;
      closestPosition = position;
    }
  });

  return closestAnchorId;
}

function scrollToAnchor(anchorId, callback) {
  if (!anchors[anchorId]) {
    return;
  }

  const rectangle = anchors[anchorId].getBoundingClientRect();
  animating = true;

  scrollTo(0, window.pageYOffset + rectangle.top, {
    'ease': 'in-cube',
    'duration': SCROLL_DURATION,
  });

  if (animationTimer) {
    clearTimeout(animationTimer);
  }
  animationTimer = setTimeout(() => {
    animating = false;
    if (callback) {
      callback();
    }
  }, SCROLL_ANIMATION_DISABLE_PERIOD);
}

function getHeaderOffset() {
  return headerOffset;
}

function setHeaderOffset(newHeaderOffset) {
  // Ensure that the initial render is complete by pushing this to the end of the event queue
  headerOffset = newHeaderOffset;
  setTimeout(() => {
    _.forOwn(subscriptions, subscription => subscription(newHeaderOffset));
    onAnchorDidMount();
  }, 0);
}

function setAnchorMountCallback(callback) {
  onAnchorDidMount = callback;
}

function subscribeAnchor(anchorId, anchor, callback) {
  if (__DEBUG__ && anchors[anchorId]) {
    // eslint-disable-next-line no-console
    console.warn(`Anatomy Header: Anchor ID ’${anchorId}’ has already been used and will be overwritten.`);
  }
  anchors[anchorId] = anchor;
  subscriptions[anchorId] = callback;
}

function unsubscribeAnchor(anchorId) {
  delete anchors[anchorId];
  delete subscriptions[anchorId];
}

export {
  getActiveAnchorFromScrollPosition,
  getHeaderOffset,
  scrollToAnchor,
  setAnchorMountCallback,
  setHeaderOffset,
  subscribeAnchor,
  unsubscribeAnchor,
};
