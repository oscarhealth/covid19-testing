// @flow
import React from 'react';
import {defineMessages, FormattedMessage} from 'react-intl';

import {TextLink} from 'common/TextLink';
import {Header5, SubText} from 'common/typography';
import {useIntl} from 'intl/context';

import css from './NoResults.scss';

const Messages = defineMessages({
  HEADER: {
    defaultMessage:
      'There are currently no COVID-19 testing sites in your search area.',
    description: 'Header for when there are no testings sites near you',
    id: 'search.noResults.title',
  },
});

export default function NoResults() {
  const intl = useIntl();
  return (
    <div className={css.container}>
      <div className={css.content}>
        <Header5 className={css.paragraph}>
          {intl.formatMessage(Messages.HEADER)}
        </Header5>
        <SubText className={css.paragraph}>
          <FormattedMessage
            defaultMessage="However, testing is available at healthcare facilities across the country. To inquire about receiving a COVID-19 test in this area, consult your state or local health department website, or call your healthcare provider and tell them about your symptoms and your exposure. They will decide whether you need to be tested, but keep in mind that there is no treatment for COVID-19 and people who are mildly ill may be able to isolate and care for themselves at home."
            description="Explanation to contact local health deparatment"
            id="search.noResults.contactForTest"
          />
        </SubText>
      </div>
    </div>
  );
}
