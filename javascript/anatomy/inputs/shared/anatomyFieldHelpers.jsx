import KeyCode from 'keycode-js';
import {noop, throttle} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import {KeyPressSearcher} from './KeyPressSearcher';
import {getDisplayName} from './anatomyUtil';

export function withManagedFocus() {
  return (Component) =>
    class extends React.PureComponent {
      static displayName = getDisplayName(Component, 'withManagedFocus');

      static propTypes = {
        /**
         * This function will be called with a reference to this instance. This is useful for programmatically
         * setting the underlying DOM element's focus (the element that is passed to inputRef).
         */
        focusRef: PropTypes.func,
        inputRef: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
      };

      static defaultProps = {
        focusRef: noop,
        inputRef: noop,
        onBlur: noop,
        onFocus: noop,
      };

      state = {
        isFocused: false,
      };

      componentDidMount() {
        this.props.focusRef(this);
      }

      /**
       * Parents (or children) of this component can use this method in conjunction with the ref passed to focusRef
       * to set the browser focus to whatever element is passed to inputRef (via the children of this component).
       *
       * Note that this will automatically trigger onFocus as well via normal DOM behavior.
       */
      focus = () => {
        this.inputRef.focus();
      };

      onBlur = (event) => {
        this.setState({
          isFocused: false,
        });

        this.props.onBlur(event);
      };

      onFocus = (event) => {
        this.setState({
          isFocused: true,
        });

        this.props.onFocus(event);
      };

      setInputRef = (ref) => {
        this.inputRef = ref;
        this.props.inputRef(ref);
      };

      render() {
        const {focusRef, ...rest} = this.props;
        return (
          <Component
            {...this.state}
            {...rest}
            focus={this.focus}
            inputRef={this.setInputRef}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          />
        );
      }
    };
}

/**
 * This HOC is useful for certain fields that have multiple focus states. An example is typeaheads: either the
 * text input within the typeahead or the field in general can be focused. This adds a separate focus state from
 * 'withManagedFocus' with a more limited set of functionality.
 */
export function withFieldFocus() {
  return (Component) =>
    class extends React.PureComponent {
      static displayName = getDisplayName(Component, 'withFieldFocus');

      static propTypes = {
        onFieldBlur: PropTypes.func,
        onFieldFocus: PropTypes.func,
      };

      static defaultProps = {
        onFieldBlur: noop,
        onFieldFocus: noop,
      };

      state = {
        isFieldFocused: false,
      };

      focusField = () => {
        this.fieldRef.focus();
      };

      onFieldBlur = () => {
        this.setState({
          isFieldFocused: false,
        });
      };

      onFieldFocus = () => {
        this.setState({
          isFieldFocused: true,
        });
      };

      setFieldRef = (ref) => {
        this.fieldRef = ref;
      };

      render() {
        return (
          <Component
            {...this.state}
            {...this.props}
            fieldRef={this.setFieldRef}
            focusField={this.focusField}
            onFieldBlur={this.onFieldBlur}
            onFieldFocus={this.onFieldFocus}
          />
        );
      }
    };
}

export function withHighlightableList({
  enableCharacterSearch = false,
  onHighlightThrottleMilliseconds = 25,
} = {}) {
  return (Component) =>
    class extends React.PureComponent {
      static displayName = getDisplayName(Component, 'withHighlightableList');

      static propTypes = {
        /**
         * This is an alias for the options prop.
         */
        choices: PropTypes.arrayOf(PropTypes.array),
        /**
         * Function that determines what string representation of each option should be used to search when inputting
         * alphanumeric characters. It is provided the individual option array (e.g. it contains the key and what to
         * render) as the only argument, and should return the desired string. This is necessary when the option values
         * are not strings.
         */
        getSearchStringFromOption: PropTypes.func,
        options: PropTypes.arrayOf(PropTypes.array),
      };

      static defaultProps = {
        options: [],
      };

      constructor(props) {
        super(props);

        this.keyPressSearcher = new KeyPressSearcher(props.getSearchStringFromOption);
        this.state = {
          highlightedIndex: this.getBoundedIndex(props, this.getInitialIndex()),
          highlightedWithKeyPress: false,
        };
        this.throttledOnHighlight = throttle(
          this.onHighlight,
          onHighlightThrottleMilliseconds,
          {leading: true}
        );
      }

      componentWillReceiveProps(nextProps) {
        if (this.state.highlightedIndex >= nextProps.options.length) {
          this.setState({
            highlightedIndex: this.getBoundedIndex(
              nextProps,
              this.state.highlightedIndex
            ),
            highlightedWithKeyPress: false,
          });
        }
      }

      getBoundedIndex = (props, index) => {
        return Math.max(Math.min(index, this.getOptions(props).length - 1), 0);
      };

      getInitialIndex = () => {
        const currentValues = [].concat(this.props.value);
        return this.getOptions().findIndex(
          ([optionKey]) => currentValues.indexOf(optionKey) !== -1
        );
      };

      getOptions = (props = this.props) => {
        return props.choices || props.options;
      };

      onCharacterKeyPress = (key) => {
        const index = this.keyPressSearcher.addAndFindIndex(
          key,
          this.getOptions(),
          this.state.highlightedIndex
        );

        if (index !== -1) {
          this.setState({
            highlightedIndex: index,
            highlightedWithKeyPress: true,
          });
        }
      };

      onHighlight = (index, simulateKeypress = false) => {
        this.setState({
          highlightedIndex: index,
          highlightedWithKeyPress: simulateKeypress,
        });
      };

      onHighlightedIndexIncrement = (increment) => {
        this.setState((prevState) => ({
          highlightedIndex: this.getBoundedIndex(
            this.props,
            prevState.highlightedIndex + increment
          ),
          highlightedWithKeyPress: true,
        }));
      };

      onKeyDown = (e) => {
        switch (e.which) {
          case KeyCode.KEY_DOWN:
            e.preventDefault();
            this.onHighlightedIndexIncrement(1);
            return;

          case KeyCode.KEY_UP:
            e.preventDefault();
            this.onHighlightedIndexIncrement(-1);
            return;
        }

        if (enableCharacterSearch && e.key.match(/^[\w ]{1}$/)) {
          this.onCharacterKeyPress(e.key);
        }
      };

      render() {
        return (
          <Component
            {...this.state}
            {...this.props}
            onHighlight={this.throttledOnHighlight}
            onKeyDown={this.onKeyDown}
          />
        );
      }
    };
}
