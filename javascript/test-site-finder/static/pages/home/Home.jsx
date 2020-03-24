// @flow
import classNames from 'classnames';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';

import {Header2, Header4, Text, SubText} from 'common/typography';

import RightArrow from './RightArrow.svg';

import css from './Home.scss';

function HomePage() {
  return (
    <div className={css.pageContainer}>
      <div className={css.heroContainer}>
        <div className={css.heroContent}>
          <Header2 className={css.title} component={'h1'}>
            <FormattedMessage
              defaultMessage="Coronavirus (COVID-19) Testing Resource Center"
              description=""
              id="home.title.text"
            />
          </Header2>
        </div>
      </div>
      <div className={css.actionsWrapper}>
        <Link
          className={classNames(css.actionContainer, css.actionAssessment)}
          to="/assessment"
        >
          <div className={css.actionTitle}>
            <Header4 component={'h2'}>
              <FormattedMessage
                defaultMessage="Take a COVID-19 assessment survey"
                description=""
                id="home.action.takeSurvey"
              />
            </Header4>
          </div>
          <div className={css.actionSubtitle}>
            <Text>
              <FormattedMessage
                defaultMessage="Understand your risk and learn about the precautions to take for staying safe."
                description=""
                id="home.action.takeSurvey.description"
              />
            </Text>
          </div>
          <img alt="" src={RightArrow} className={css.arrow} />
        </Link>
        <Link
          className={classNames(css.actionContainer, css.actionLocation)}
          to="/location"
        >
          <div className={css.actionTitle}>
            <Header4 component={'h2'}>
              <FormattedMessage
                defaultMessage="Find a testing site"
                description=""
                id="home.action.findSite"
              />
            </Header4>
          </div>
          <div className={css.actionSubtitle}>
            <Text>
              <FormattedMessage
                defaultMessage="COVID-19 testing is available in health care facilities across the country, find one here."
                description=""
                id="home.action.findSite.description"
              />
            </Text>
          </div>
          <img alt="" src={RightArrow} className={css.arrow} />
        </Link>
      </div>
      <SubText className={css.footer}>
        <FormattedMessage
          defaultMessage="For everyone’s safety, please practice social distancing—even if you do not have symptoms of COVID-19 such as fever, cough, and shortness of breath."
          description=""
          id="home.footer"
        />
      </SubText>
    </div>
  );
}

export default HomePage;
