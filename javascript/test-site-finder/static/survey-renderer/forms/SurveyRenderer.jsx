import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Field, reduxForm} from 'redux-form';

import {PageAnchor} from 'common/page-anchor/PageAnchor';
import {SurveyOptionsLabel} from 'common/typography';

import {MarkdownRenderer} from 'survey-renderer/markdown/MarkdownRenderer';
import {DisplayFieldTypes} from 'survey-renderer/FieldTypes';
import {
  CheckboxInputGroup,
  RadioInputGroup,
} from 'survey-renderer/fields/BooleanInputGroup';
import {getValidationsForField} from 'survey-renderer/fields/FieldTypeValidations';
import {FIELD_VALIDATION_ERROR} from 'survey-renderer/reducers/ClientValidationError';

import {FieldSection} from './FieldSection';
import {
  ANCHOR_PREFIX,
  SurveyRendererOverride,
  scrollToFormId,
} from './SurveyRendererOverride';

import css from './SurveyRenderer.scss';

export function FormFieldWrapper({
  index,
  field,
  fieldComponent,
  disabled,
  slug,
  language,
}) {
  const labelElementId = _.uniqueId(`survey-field-label-${field.name}-`);
  return (
    <div key={index}>
      {field.name && <PageAnchor anchorId={`${ANCHOR_PREFIX}-${field.name}`} />}
      <div
        className={
          field.type === DisplayFieldTypes.static ? css.textField : css.questionField
        }
      >
        {field.type !== DisplayFieldTypes.static &&
          field.type !== DisplayFieldTypes.section && (
            <div className={css.fieldLabel}>
              <SurveyOptionsLabel id={labelElementId}>
                {field.description}
              </SurveyOptionsLabel>
            </div>
          )}
        <FormField
          disabled={disabled}
          field={field}
          fieldComponent={fieldComponent}
          key={index}
          labelElementId={labelElementId}
          language={language}
          slug={slug}
        />
      </div>
    </div>
  );
}

export class FormField extends React.PureComponent {
  static defaultProps = {
    fieldComponent: Field,
  };

  constructor(props) {
    super(props);
    this.validatorCache = {};
    this.previousLanguage = 'en';
  }

  render() {
    const {
      disabled,
      field,
      labelElementId,
      language,
      fieldComponent: FieldComponent,
    } = this.props;
    const {options} = field;

    if (!this.validatorCache[field.name] || this.previousLanguage !== language) {
      this.validatorCache[field.name] = getValidationsForField(field, language);
      this.previousLanguage = language;
    }

    const defaultProps = {
      'aria-labelledby': labelElementId,
      'name': field.name,
      'validate': this.validatorCache[field.name],
      'theme': 'contained',
      'size': 'small',
      'disabled': disabled,
      'language': language,
    };

    switch (field.type) {
      case DisplayFieldTypes.checkbox:
        return (
          <FieldComponent
            {...defaultProps}
            choices={options.choices}
            component={CheckboxInputGroup}
          />
        );
      case DisplayFieldTypes.radio: {
        return (
          <FieldComponent
            {...defaultProps}
            choices={options.choices}
            component={RadioInputGroup}
          />
        );
      }
      case DisplayFieldTypes.static:
        return (
          <MarkdownRenderer
            rendererOverride={SurveyRendererOverride}
            value={field.options.description}
          />
        );
      case DisplayFieldTypes.section:
        // We are not currently using the section title and description and so have nothing to render. The section's
        // "title" and "description" are being rendered with Markdown-rendered static fields instead.
        return null;
      default:
        // Error case fallback
        if (__DEBUG__) {
          throw new Error(`Cannot match field type “${field.type}”`);
        }
        return null;
    }
  }
}

export function SurveyRenderer({
  viewSchema,
  handleSubmit,
  initialValues,
  submitting,
  error,
  form,
}) {
  const [disabled, setDisabled] = useState(false);

  const fieldsByName = {};
  viewSchema.fields.forEach((field) => {
    fieldsByName[field.name] = field;
  });

  return (
    <div>
      {viewSchema.sections.map((section, index) => (
        <div className={css.fieldSection}>
          <FieldSection
            formName={form}
            formValues={viewSchema}
            key={section.name}
            section={section}
            setDisabled={setDisabled}
            index={index}
          >
            {section.fields.map((fieldName) => (
              <FormFieldWrapper
                disabled={disabled}
                field={fieldsByName[fieldName]}
                index={fieldName}
                key={fieldName}
                language={viewSchema.language}
                slug={viewSchema.slug}
              />
            ))}
          </FieldSection>
        </div>
      ))}
    </div>
  );
}

SurveyRenderer.propsTypes = {
  viewSchema: PropTypes.shape({
    fields: PropTypes.array.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  isSubmitting: PropTypes.bool,
};

export function connectSurveyForm(reduxFormArgs) {
  const originalOnSubmitFail = reduxFormArgs.onSubmitFail;
  const onSubmitFail = (errors, dispatch, ...args) => {
    if (errors) {
      const erroredFields = Object.keys(errors);
      if (erroredFields) {
        scrollToFormId(erroredFields[0]);
      }
      dispatch({
        type: FIELD_VALIDATION_ERROR,
        errors: errors,
      });
    }
    if (originalOnSubmitFail) {
      originalOnSubmitFail(errors, ...args);
    }
  };

  const ReduxFormComponent = reduxForm({...reduxFormArgs, onSubmitFail})(
    SurveyRenderer
  );
  return ReduxFormComponent;
}
