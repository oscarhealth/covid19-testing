import React, {useContext} from 'react';
import classNames from 'classnames';

import {Button} from 'common/button';
import {useIntl} from 'intl/context';

import {LanguageContext} from '../index';

import findSvg from './Find.svg';
import globeSvg from './Globe.svg';

import css from './Nav.scss';

const Nav = ({isFullScreen = false, setLanguage}) => {
  const intl = useIntl();
  const isEnglish = useContext(LanguageContext) === 'en';
  const onLanguageClick = () => {
    if (isEnglish) {
      setLanguage('es');
    } else {
      setLanguage('en');
    }
  };

  const goHome = () => {
    // use onclick so that when in zipcode flow it still resets the page
    window.location = '/';
  };

  const languageToggle = (
    <Button
      className={classNames({
        [css.button]: true,
        [css.fullWidthButton]: isFullScreen,
      })}
      onClick={onLanguageClick}
      type={'knocked-out'}
    >
      <span className={css.globeWrapper}>
        <img alt="" src={globeSvg} className={css.globe} />
      </span>
      {isEnglish ? 'Español' : 'English'}
    </Button>
  );

  const content = (
    <nav className={css.insideContainer}>
      <div
        className={classNames({
          [css.homeContainer]: true,
          [css.fullWidthLogo]: isFullScreen,
        })}
      >
        <a onClick={goHome}>
          <img
            alt={intl.formatMessage({
              defaultMessage: 'Return to homepage',
              description: 'find by Richard from the Noun Project',
              id: 'home.nav.logo',
            })}
            src={findSvg}
            className={css.logo}
          />
        </a>
      </div>
      {/*{languageToggle}*/}
    </nav>
  );

  let container;

  if (!isFullScreen) {
    container = <div className={css.gridContainer}>{content}</div>;
  } else {
    container = content;
  }

  return <div className={css.container}>{container}</div>;
};

export default Nav;
