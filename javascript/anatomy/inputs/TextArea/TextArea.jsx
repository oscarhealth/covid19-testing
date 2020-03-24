// @flow
import type {AbstractComponent} from 'react';

import {withManagedFocus} from 'javascript/anatomy/inputs/shared/anatomyFieldHelpers';
import {withAnatomyContextProvider} from 'javascript/anatomy/inputs/shared/anatomyTypes';
import {withFieldMessages} from 'javascript/anatomy/inputs/shared/fieldMessages';
import {compose} from 'javascript/anatomy/util/compose';

import {TextAreaBase} from './TextAreaBase';
import type {TextAreaProps} from './TextAreaBase';
import {withAutoGrow} from './textAreaAutoGrow';

export const TextArea: AbstractComponent<TextAreaProps> = compose(
  withFieldMessages(),
  withManagedFocus(),
  withAnatomyContextProvider(),
  withAutoGrow()
)(TextAreaBase);
