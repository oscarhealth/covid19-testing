// @flow
import React, {useLayoutEffect} from 'react';

import {Header2, Text} from 'common/typography';
import {connectSurveyForm} from 'survey-renderer/forms/SurveyRenderer';
import Nav from 'nav/Nav';

import config from './config';
import css from './index.scss';

const ConnectedFormPreview = connectSurveyForm({form: 'covidForm'});

type Props = {|
  setLanguage: any,
|};

const Assessment = ({setLanguage}: Props): React.Component => {
  useLayoutEffect(() => {
    // We want to ensure that the user starts at the top of the survey so they can read the full description in case the
    // scroll position is preserved from the previous page.
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Nav setLanguage={setLanguage} />
      <div className={css.headerContainer}>
        <div className={css.headerContent}>
          <Header2 className={css.title}>{config.name}</Header2>
          <Text className={css.description}>{config.description}</Text>
        </div>
      </div>
      <div className={css.surveyContainer}>
        <div className={css.surveyContent}>
          <ConnectedFormPreview viewSchema={config} />
        </div>
      </div>
    </>
  );
};

export default Assessment;
