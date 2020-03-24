import React from 'react';
import ReactMarkdown from 'react-markdown';
import 'url-search-params-polyfill';

import {TextLink} from 'common/TextLink';
import {Button} from 'common/button';
import {
  SurveyHeading1,
  SurveyHeading2,
  SurveyHeading3,
  SurveyHeading4,
  SurveyHeading5,
  SurveyText,
} from 'common/typography';

import css from './MarkdownRenderer.scss';

const HEADING_CASE = {
  1: SurveyHeading1,
  2: SurveyHeading2,
  3: SurveyHeading3,
  4: SurveyHeading4,
  5: SurveyHeading5,
  6: SurveyHeading5,
};

const MarkdownRenderers = {
  break: 'br',
  thematicBreak: 'hr',
  strong: ({children}) => <strong component="span">{children}</strong>,
  emphasis: ({children}) => <em className={css.em}>{children}</em>,
  paragraph: ({children}) => (
    <SurveyHeading2 className={css.p}>{children}</SurveyHeading2>
  ),
  heading: ({level, children, value}) => {
    const TitleType = HEADING_CASE[level];
    return <TitleType>{children}</TitleType>;
  },
  link: ({href, children}) => {
    return <TextLink href={href}>{children}</TextLink>;
  },
  linkReference: ({children}) => {
    // this seems to only happen if markdown is [hi] normal text
    // if they do [hi](link.com) normal text, it gets picked up by link
    return <SurveyText component="span">[{children}]</SurveyText>;
  },
  list: ({children}) => {
    return <SurveyText>{children}</SurveyText>;
  },
  tableCell: ({children, isHeader}) => {
    const El = isHeader ? 'th' : 'td';
    return <El className={css.tableElement}>{children}</El>;
  },
  text: ({children, value}) => {
    const params = new URLSearchParams(document.location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');
    const nextUrl = '/location';
    // NOTE: This is a hack to get this button to appear at the desired location in the survey. Any text in your
    //       Markdown that looks like `\n\n__BUTTON` or `\n\n__BUTTON\n\n` will be rendered instead as the button.
    switch (value) {
      case '__BUTTON':
        return (
          <Button className={css.button} to={nextUrl} type="primary">
            Find testing sites
          </Button>
        );
      default:
        return children;
    }
  },
};

export const MarkdownRenderer = ({value, rendererOverride = {}}) => (
  <ReactMarkdown
    renderers={Object.assign(MarkdownRenderers, rendererOverride)}
    source={value || ''}
  />
);
