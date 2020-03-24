// @flow
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {FinePrint} from 'common/typography';

import css from './Banner.scss';

export default function Banner() {
  return (
    <div className={css.banner}>
      <FinePrint className={css.bannerText}>
        <FormattedMessage
          defaultMessage="To improve your wait time, we strongly encourage you to visit during our recommended testing window. Hours of operation may differ from those displayed."
          description=""
          id="search.banner"
        />
      </FinePrint>
    </div>
  );
}
