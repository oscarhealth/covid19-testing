export function getDisplayName(component, thunkName) {
  const name = component.displayName || component.name;
  const regEx = /\(([^()]+)\)/g;
  const matches = regEx.exec(name);

  const nameToUse = !matches || matches.length < 2 ? name : matches[1];
  if (!thunkName) {
    return nameToUse;
  }

  return `${thunkName}(${nameToUse})`;
}

export function filterFormProps(props) {
  const {
    _name,
    _prefix,
    _translations,
    appendEntry,
    el,
    fields,
    handleChange,
    handleFocus,
    isDisabled,
    isValid,
    removeEntry,
    revealed,
    setChoices,
    shortName,
    touched,
    validators,
    widget,
    ...rest
  } = props;

  return rest;
}
