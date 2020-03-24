// @flow
import React from 'react';
import type {AbstractComponent} from 'react';

import {withAnatomyContextProvider} from 'javascript/anatomy/inputs/shared/anatomyTypes';
import {withFieldMessages} from 'javascript/anatomy/inputs/shared/fieldMessages';
import {compose} from 'javascript/anatomy/util/compose';

import {TypeaheadBase} from './TypeaheadBase';

type OptionType = [any, string];
type OptionsType = OptionType[];

function getTextFromValue(value: ?string, options: OptionsType) {
  const option = options.find((option) => option[0] === value);
  return option ? option[1] : null;
}

type Props = {
  clearOnEmptyQuery?: boolean,
  disabled?: boolean,
  fetchOnMount?: boolean,
  /**
   * Function that fetches the set of options to show. The function is provided the query as the first
   * argument and a callback as the second argument. The callback should be called when the options are
   * ready, and takes in the options array as the first argument and the query as the second (for optimizations
   * when there are multiple queries in flight). The third argument is an error callback that should be
   * called if there are any errors in fetching the options.
   */
  fetchOptions: (
    string,
    (options: OptionsType, query: string) => void,
    () => void
  ) => void,
  /**
   * Function that determines what text to show in the typeahead, given the value as the first argument and the
   * options list as the second. This is necessary if the values are not suitable for rendering (for example,
   * if the values are numerical keys).
   */
  getTextFromValue: (?string, OptionsType) => ?string,
  hasErrors?: boolean,
  /**
   * Highlights (css bold) substrings in dropdown that user input query (contains ignore case)
   * Does not work if you are using a custom optionComponent prop
   */
  highlightMatchedSubstring?: boolean,
  id?: string,
  initialOptions: OptionsType,
  initialQuery: string,
  label: string,
  onBlur: () => void,
  onChange: (?string) => void,
  onFocus: () => void,
  /**
   * If provided, this component will be used to render the options.
   */
  optionComponent?: AbstractComponent<any>,
  size?: 'small' | 'medium',
  theme?: 'standard' | 'contained',
  useFieldHeader?: boolean,
  value?: any,
};

type State = {
  cachedText: ?string,
  hasFetchError: boolean,
  isLoading: boolean,
  options: [any, any][],
  query: string,
};

export class Typeahead extends React.PureComponent<Props, State> {
  static defaultProps = {
    clearOnEmptyQuery: false,
    disabled: false,
    highlightMatchedSubstring: true,
    fetchOnMount: true,
    getTextFromValue,
    hasErrors: false,
    initialOptions: [],
    initialQuery: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
  };

  state = {
    cachedText: null,
    hasFetchError: false,
    isLoading: false,
    query: this.props.initialQuery,
    options: this.props.initialOptions,
  };

  componentDidMount() {
    if (this.props.fetchOnMount && this.props.initialQuery) {
      this.fetchOptions(this.props.initialQuery);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    // Clear the cachedText on empty value prop so the parent can clear the typeahead display
    // 0 and false are supported values, so keep the cachedText in those cases
    if (
      nextProps.value === '' ||
      nextProps.value === undefined ||
      nextProps.value === null
    ) {
      this.setState({
        cachedText: null,
      });
    } else {
      const newText = nextProps.getTextFromValue(nextProps.value, this.state.options);
      if (newText && newText !== this.state.cachedText) {
        // Store the display text for the selected value to prevent losing it if the query/options change
        this.setState({
          cachedText: newText,
        });
      }
    }
  }

  fetchErrorCallback = () => {
    this.setState({
      hasFetchError: true,
      isLoading: false,
      options: [],
    });
  };

  fetchOptions = (query: string) => {
    this.setState(
      {
        isLoading: !!query,
        query,
      },
      () => {
        if (query) {
          this.props.fetchOptions(
            query,
            this.fetchOptionsCallback,
            this.fetchErrorCallback
          );
        }
      }
    );
  };

  fetchOptionsCallback = (options: OptionsType, query: string) => {
    if (query !== this.state.query) {
      return;
    }

    this.setState({
      hasFetchError: false,
      isLoading: false,
      options,
    });
  };

  onChangeQuery = (evt: SyntheticEvent<HTMLInputElement>) => {
    this.fetchOptions(evt.currentTarget.value);
  };

  onBlur = () => {
    // if clearOnEmptyQuery is true, clear the typeahead data and update the displayed value to be empty when the
    // query is an empty string
    if (this.props.clearOnEmptyQuery && this.state.query === '') {
      this.props.onChange(null);
      this.setState({
        cachedText: null,
      });
    }

    this.props.onBlur();
  };

  render() {
    return (
      <TypeaheadBase
        {...this.state}
        options={this.props.results}
        {...this.props}
        isLoading={false}
        onBlur={this.onBlur}
        onChangeQuery={this.onChangeQuery}
        valueAsString={
          this.state.cachedText ||
          this.props.getTextFromValue(this.props.value, this.state.options)
        }
      />
    );
  }
}

Typeahead = compose(
  withFieldMessages(),
  withAnatomyContextProvider()
)(Typeahead);
