import React from 'react';
import css from './index.scss';

/**
 * Stateless CSS reset component. Doesn't really need to do anything; if you
 * pull this file in anywhere in your project the CSS will be included and
 * since it's all globals it should Just Work.
 */
export class CSSReset extends React.Component {
  render() {
    return <noscript />;
  }
}
