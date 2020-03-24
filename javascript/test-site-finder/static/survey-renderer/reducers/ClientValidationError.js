export const FIELD_VALIDATION_ERROR = 'formSubmissions/FIELD_VALIDATION_ERROR';
export const CLEAR_FIELD_VALIDATION_ERROR =
  'formSubmissions/CLEAR_FIELD_VALIDATION_ERROR';

export function clearFieldValidationError() {
  return (dispatch) => {
    dispatch({type: CLEAR_FIELD_VALIDATION_ERROR});
    return Promise.resolve();
  };
}

export const INITIAL_VALUE = {
  errors: null,
};

export function clientValidationError(state = INITIAL_VALUE, action) {
  switch (action.type) {
    case FIELD_VALIDATION_ERROR:
      return {
        ...state,
        errors: action.errors,
      };
    case CLEAR_FIELD_VALIDATION_ERROR:
      return {
        ...state,
        errors: null,
      };
    default:
      return state;
  }
}
