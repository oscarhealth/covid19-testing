// @flow
import React, {useCallback, useEffect, useRef} from 'react';
import type {ChildrenArray, Element} from 'react';

import css from './MarkerTooltip.scss';

type Props = {
  children?: ChildrenArray<Element<any>> | Element<any> | string,
};

/**
 * MarkerTooltip renders a custom tooltip for a map marker. This should only be used by the Marker component.
 */
const MarkerTooltip = ({children}: Props) => {
  const tooltipRef = useRef<?HTMLDivElement>();

  const centerTooltip = useCallback(() => {
    if (!tooltipRef.current) {
      return;
    }

    tooltipRef.current.style.transform = 'translateX(-50%)';
  }, [tooltipRef]);

  useEffect(() => {
    centerTooltip();
  });

  return (
    <div className={css.tooltip} ref={tooltipRef}>
      {children}
    </div>
  );
};

export {MarkerTooltip};
