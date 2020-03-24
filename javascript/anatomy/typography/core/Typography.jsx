// @flow
import classNames from 'classnames/dedupe';
import PropTypes from 'prop-types';
import React from 'react';
import type {Node} from 'react';

import css from './Typography.scss';

type Props = {|
  children: ?Node,
  className?: string,
  color?:
    | 'blue-black'
    | 'dark-teal'
    | 'dark-red'
    | 'dark-yellow'
    | 'light-blue'
    | 'text'
    | 'text-light',
  component?: string,
|};

function createTypographyComponent(fontClassName, displayName, defaultComponent) {
  return class extends React.Component<Props> {
    static displayName = displayName;

    static propTypes = {
      color: PropTypes.oneOf([
        'blue-black',
        'dark-teal',
        'dark-red',
        'dark-yellow',
        'light-blue',
        'text',
        'text-light',
      ]),
      component: PropTypes.string,
    };

    render() {
      const {className = null, component = defaultComponent, ...props} = this.props;

      const whitelistedComponents = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'a',
        'div',
        'span',
        'li',
        'ul',
        'ol', // Changes the text styling of the list numbers
      ];
      if (__DEBUG__ && !!component && !whitelistedComponents.includes(component)) {
        throw new Error(
          `Received anatomy text component: ${component}. Pass one of \
          {${whitelistedComponents.join(', ')}} instead.`
        );
      }

      const Component = component; // Alias since linter wants all components to begin with an upper case letter

      const componentClassName = classNames(className, fontClassName, {
        [css['color__blue-black']]: this.props.color === 'blue-black',
        [css['color__light-blue']]: this.props.color === 'light-blue',
        [css['color__dark-teal']]: this.props.color === 'dark-teal',
        [css['color__dark-red']]: this.props.color === 'dark-red',
        [css['color__dark-yellow']]: this.props.color === 'dark-yellow',
        [css['color__text']]: this.props.color === 'text',
        [css['color__text-light']]: this.props.color === 'text-light',
      });

      return (
        <Component className={componentClassName} {...props}>
          {this.props.children}
        </Component>
      );
    }
  };
}

export const Intro = createTypographyComponent(css.intro, 'Intro', 'h2');
export const PageTitle = createTypographyComponent(css.pageTitle, 'PageTitle', 'h1');
export const SerifTitle = createTypographyComponent(css.serifTitle, 'SerifTitle', 'h1');
export const SerifTitleSmall = createTypographyComponent(
  css.serifTitleSmall,
  'SerifTitleSmall',
  'h2'
);
export const PrimaryText = createTypographyComponent(
  css.primaryText,
  'PrimaryText',
  'div'
);
export const SecondaryTitle = createTypographyComponent(
  css.secondaryTitle,
  'SecondaryTitle',
  'h3'
);
export const SubText = createTypographyComponent(css.subText, 'SubText', 'div');
export const Text = createTypographyComponent(css.text, 'Text', 'div');
export const Title1 = createTypographyComponent(css.title1, 'Title1', 'h1');
export const Title2 = createTypographyComponent(css.title2, 'Title2', 'h2');
export const Title3 = createTypographyComponent(css.title3, 'Title3', 'h3');
export const Title4 = createTypographyComponent(css.title4, 'Title4', 'h4');
