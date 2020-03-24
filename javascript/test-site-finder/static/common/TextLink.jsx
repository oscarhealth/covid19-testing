import React from 'react';
import {Link} from 'react-router-dom';

import css from './TextLink.scss';

export function TextLink({children, href, to, ...restProps}) {
  let Component;
  const linkProps = {};

  if (to) {
    Component = Link;
    linkProps.to = to;
  } else {
    Component = 'a';
    linkProps.href = href;
  }

  return (
    <Component className={css.textLink} {...restProps} {...linkProps}>
      {children}
    </Component>
  );
}
