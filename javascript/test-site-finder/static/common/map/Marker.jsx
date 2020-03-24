// @flow
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import type {ChildrenArray, Element} from 'react';

import {wrapConfigElements} from 'javascript/anatomy/util/ConfigElements';

import {MarkerTooltip} from './MarkerTooltip';
import type {LatLngLiteral} from './types';

import defaultPin from './assets/defaultPin.svg';
import hoverPin from './assets/hoverPin.png';
import selectedPin from './assets/selectedPin.png';

import css from './Marker.scss';

export const PinStyle = {
  DEFAULT: 'DEFAULT',
  HOVER: 'HOVER',
  SELECTED: 'SELECTED',
  PULSE: 'PULSE',
};

export type PinStyleType = $Keys<typeof PinStyle>;

type PinElementType = {
  style: PinStyleType,
};

type MarkerProps = {
  elements: {
    Pin: PinElementType,
    Tooltip?: {
      children: ChildrenArray<Element<any>>,
    },
  },
  // Force the marker to a hovered state. Example use case: user hovers on list item and we want to force hover
  // state on the marker.
  forceHover?: boolean,
  id: string,
  onClick?: (id: string) => void,
  onHover?: (id: ?string) => void,
  // Position is used by the map to determine where to place the marker.
  position: LatLngLiteral,
};

const Pin = ({pinElement}: {pinElement: PinElementType}) => {
  const highlightedPinClasses = classNames({
    [css.pin]: true,
    [css.pinHighlighted]: true,
  });

  switch (pinElement.style) {
    case PinStyle.HOVER:
      return <img alt="hover-pin" className={highlightedPinClasses} src={hoverPin} />;
    case PinStyle.SELECTED:
      return (
        <img alt="selected-pin" className={highlightedPinClasses} src={selectedPin} />
      );
    case PinStyle.PULSE:
      return (
        <div className={css.pulseContainer}>
          <div className={css.pulsePin} />
          <div className={css.pulse} />
        </div>
      );
    case PinStyle.DEFAULT:
    default:
      return <img alt="default-pin" className={css.pin} src={defaultPin} />;
  }
};

/**
 * Marker creates an overlay with a pin and tooltip on a Map component.
 * Usage:
 *   <Marker id="example" position={{lat: 0, lng: 0}}>
 *     <Marker.Pin style={PinStyle.DEFAULT} />
 *     <Marker.Tooltip>
 *       Tooltip info
 *     </Marker.Tooltip>
 *   </Marker>
 */
const MarkerComponent = ({elements, forceHover, id, onClick, onHover}: MarkerProps) => {
  if (!elements.Pin) {
    throw new Error('Pin is required');
  }

  return (
    <div
      onClick={() => onClick && onClick(id)}
      onMouseOut={() => onHover && onHover(null)}
      onMouseOver={() => onHover && onHover(id)}
    >
      <Pin pinElement={elements.Pin} />
      {elements.Tooltip && forceHover && (
        <MarkerTooltip>{elements.Tooltip.children}</MarkerTooltip>
      )}
    </div>
  );
};

const Marker = wrapConfigElements({
  Pin: {
    style: PropTypes.string,
  },
  Tooltip: {
    children: PropTypes.node,
  },
})(MarkerComponent);

export {Marker};
