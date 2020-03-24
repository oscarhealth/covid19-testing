import React from 'react';

import {TextLink} from 'common/TextLink';
import {scrollToAnchor} from 'common/page-anchor/PageAnchor';

export const ANCHOR_PREFIX = 'formAnchor';

export function scrollToFormId(formId) {
  scrollToAnchor(`${ANCHOR_PREFIX}-${formId}`);
}

class LinkRenderer extends React.PureComponent {
  onClick = (evt) => {
    evt.preventDefault();
    scrollToFormId(this.props.href.substr(1));
  };

  render() {
    const {href, children} = this.props;
    const isAnchor = href[0] === '#';
    return (
      <TextLink href={href} newWindow={!isAnchor} onClick={isAnchor && this.onClick}>
        {children}
      </TextLink>
    );
  }
}

export const SurveyRendererOverride = {
  link: LinkRenderer,
};
