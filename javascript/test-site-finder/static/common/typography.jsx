// @flow
import classNames from 'classnames';
import React from 'react';
import type {Node} from 'react';

import css from './typography.scss';

type Props = {|
  children: Node,
  className?: string,
  component?: string,
|};

const makeTextComponent = (displayName, defaultComponent, fontClassName) => {
  const TextComponent = (textComponentProps: Props) => {
    const {className, component, ...componentProps} = textComponentProps;
    const Component = component || defaultComponent;
    return (
      <Component className={classNames(className, fontClassName)} {...componentProps}>
        {textComponentProps.children}
      </Component>
    );
  };
  TextComponent.displayName = displayName;
  return TextComponent;
};

export const Header1 = makeTextComponent('Header1', 'h1', css.h1);
export const Header2 = makeTextComponent('Header2', 'h2', css.h2);
export const Header3 = makeTextComponent('Header3', 'h3', css.h3);
export const Header4 = makeTextComponent('Header4', 'h4', css.h4);
export const Header5 = makeTextComponent('Header5', 'h5', css.h5);
export const Text = makeTextComponent('Text', 'span', css.text);
export const SubText = makeTextComponent('SubText', 'span', css.subText);
export const FinePrint = makeTextComponent('FinePrint', 'span', css.finePrint);

// TODO: We are keeping these separate from now since the survey UI is visually stable and consistent. Ideally, the
// renderer would use the same text as the rest of the app.
export const SurveyHeading1 = makeTextComponent(
  'SurveyTitle2',
  'h2',
  css.surveyHeading1
);
export const SurveyHeading2 = makeTextComponent(
  'SurveyHeading2',
  'h3',
  css.surveyHeading2
);
export const SurveyHeading3 = makeTextComponent(
  'SurveyTitle3',
  'h3',
  css.surveyHeading3
);
export const SurveyHeading4 = makeTextComponent(
  'SurveyTitle4',
  'h4',
  css.surveyHeading4
);
export const SurveyHeading5 = makeTextComponent(
  'SurveyHeading5',
  'div',
  css.surveyHeading5
);
export const SurveyText = makeTextComponent('SurveyText', 'div', css.surveyText);

export const SurveyOptionsLabel = makeTextComponent(
  'SurveyOptionsLabel',
  'h3',
  css.surveyOptionsLabel
);
