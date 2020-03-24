import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import React from 'react';

import {getDisplayName} from 'javascript/anatomy/inputs/shared/anatomyUtil';

import {TextAreaBase} from './TextAreaBase';

import css from './textAreaAutoGrow.scss';

export function withAutoGrow() {
  return (Component) =>
    class extends React.PureComponent {
      static displayName = getDisplayName(Component, 'withAutoGrow');

      static propTypes = {
        autoGrow: PropTypes.bool,
        inputRef: PropTypes.func,
        onChange: PropTypes.func,
        size: PropTypes.string,
        style: PropTypes.string,
        theme: PropTypes.string,
        value: PropTypes.string,
      };

      static defaultProps = {
        autoGrow: true,
        onChange: noop,
        inputRef: noop,
        value: '',
      };

      componentDidMount() {
        this.calculateTextAreaHeight();
      }

      componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
          this.calculateTextAreaHeight();
        }
      }

      componentWillUnmount() {
        if (this.heightChanger) {
          window.cancelAnimationFrame(this.heightChanger);
        }
      }

      setInputRef = (ref) => {
        this.textInput = ref;
        this.props.inputRef(ref);
      };

      calculateTextAreaHeight = () => {
        this.heightChanger = window.requestAnimationFrame(() => {
          this.hiddenTextArea.value = this.props.value;
          const inputComputedStyle = window.getComputedStyle(this.textInput);
          const newHeight =
            this.hiddenTextArea.scrollHeight -
            parseInt(inputComputedStyle.paddingTop) -
            parseInt(inputComputedStyle.paddingBottom);
          this.textInput.style.height = `${Math.max(newHeight, 0)}px`;
        });
      };

      hiddenTextAreaInputRef = (ref) => {
        this.hiddenTextArea = ref;
      };

      render() {
        const {value, autoGrow, size, theme, style} = this.props;
        if (!autoGrow) {
          return <Component {...this.props} />;
        }

        return (
          <div className={css.relative}>
            <div className={css.hiddenInput}>
              <TextAreaBase
                inputRef={this.hiddenTextAreaInputRef}
                readOnly={true}
                size={size}
                style={style}
                theme={theme}
                value={value}
              />
            </div>
            <Component {...this.props} inputRef={this.setInputRef} />
          </div>
        );
      }
    };
}
