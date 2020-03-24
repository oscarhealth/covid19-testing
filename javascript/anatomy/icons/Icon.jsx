import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import css from './Icon.scss';

// it's easier to do the loader configuration here for now, since we don't
// have a sane set of default loader configurations that we can guarantee
// everywhere. if that changes, move this out.
let iconInfo = null;
if (process.env.NODE_ENV !== 'testing') {
  iconInfo = {};
  iconInfo.requireIconNames = require.context(
    '!!babel-loader!svg-react-loader!svgo-loader' +
      // eslint-disable-next-line local/use-curly-quotes
      '?{"plugins":[{"removeDimensions":true},{"removeViewBox":false},{"removeTitle":true},{"convertPathData":false},{"removeStyleElement":true}]}!./svg'
  );
  iconInfo.knownIconFiles = new Set(iconInfo.requireIconNames.keys());
}

/**
 * To use a specific icon, import `{<IconName>Icon}` from
 * `javascript/anatomy/icons` where `<IconName>` corresponds to the name of an
 * SVG file in `javascript/anatomy/icons/svg`.
 *
 * To add a new icon, place an appropriately-sized SVG file in that directory.
 *
 * Icons inherit color from their parent, so to assign an Icon a color you must
 * apply color to its parent component.
 */
export class Icon extends React.Component {
  static propTypes = {
    /**
     * Set automatically by using a named icon component, i.e. AlertIcon.
     */
    iconName: PropTypes.string.isRequired,
    /**
     * Only for use on informative icons. Whether to treat an icon as informative or decorative is a
     * judgment that authors make, based on the reason for including the icon on the page.
     *
     * Examples:
     * If the icon is purely decorative or not intended for the user then leave this attribute blank.
     *   i.e. do not add alt="get help" to an icon next to the text "get help"
     * If the icon used in a link or a button, and would it be hard or impossible to understand
     *   what the link or the button does, if the icon wasn’t there then use
     *   use the alt attribute to communicate the destination of the link or action taken.
     *   i.e. add alt="back" to an unlabeled back button
     * If the icon is used as a label without other text, include alt text as a label.
     *   i.e. add alt="telephone:" for a phone icon distinguishing a phone number from a fax number
     * See https://www.w3.org/WAI/tutorials/images/decision-tree/ for more details
     */
    alt: PropTypes.string,
    /**
     * Sizes are 8px, 16px, 24px and 32px, respectively.
     */
    size: PropTypes.oneOf(['extraSmall', 'small', 'medium', 'large', 'extraLarge']),
  };

  static defaultProps = {
    alt: '',
    size: 'medium',
  };

  render() {
    const {iconName, size} = this.props;

    let IconSvg;
    const sizeOverrideFile = `./${iconName}.${size}.svg`;
    const ignoreSizeOverride =
      __INTERNAL_PROPS_ALLOWED__ && this.props.__ignoreSizeOverride; // eslint-disable-line no-underscore-dangle

    if (!iconInfo) {
      IconSvg = 'span';
    } else if (!ignoreSizeOverride && iconInfo.knownIconFiles.has(sizeOverrideFile)) {
      IconSvg = iconInfo.requireIconNames(sizeOverrideFile);
    } else {
      IconSvg = iconInfo.requireIconNames(`./${iconName}.svg`);
    }

    const dimensions = {
      extraSmall: 8,
      small: 16,
      medium: 24,
      large: 32,
      extraLarge: 64,
    };

    const dim = dimensions[size];

    const wrapperClasses = classNames({
      [css.iconWrapper]: true,
      [css[`iconWrapper_${size}`]]: true,
    });

    return (
      <div className={wrapperClasses}>
        <IconSvg
          aria-hidden={!this.props.alt}
          aria-label={this.props.alt}
          className={css.icon}
          height={dim}
          role="img"
          width={dim}
        />
      </div>
    );
  }
}
