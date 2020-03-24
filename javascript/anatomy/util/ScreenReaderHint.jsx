// @flow
import React from 'react';
import type {Node} from 'react';

import css from './ScreenReaderHint.scss';

type Props = {|
  children: Node,
  id?: string,
  role?: string,
|};

/**
  Use this component to render content only visible to screenreaders
  to lay out visual content or provide context.
 */
export function ScreenReaderHint({children, id, role}: Props) {
  return (
    <div aria-live="polite" className={css.screenReaderHint} id={id} role={role}>
      {children}
    </div>
  );
}
