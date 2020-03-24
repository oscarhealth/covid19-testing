import moment from 'moment';

import {DisplayFieldTypes} from 'javascript/test-site-finder/static/survey-renderer/FieldTypes';

export function requiredValidation(value, language) {
  let errorMessage = 'This field is required';
  if (language === 'es') {
    errorMessage = 'Este campo es requerido';
  }
  if (value === null || value === '' || typeof value === 'undefined') {
    return errorMessage;
  }
  if (Array.isArray(value) && !value.length) {
    return errorMessage;
  }
}

function validatorWithLanguage(translatableValidator, language) {
  const expectedValidator = function(value) {
    return translatableValidator(value, language);
  };
  return expectedValidator;
}

export function getValidationsForField({isRequired, options = {}, type}, language) {
  const validators = [];
  const optionsValidator = getValidationsForOptions(type, options);
  if (isRequired) {
    validators.push(validatorWithLanguage(requiredValidation, language));
  }
  if (optionsValidator) {
    validators.push(validatorWithLanguage(optionsValidator, language));
  }
  return validators;
}

function getValidationsForOptions(fieldType, options) {
  switch (fieldType) {
    default:
      return null;
  }
}
