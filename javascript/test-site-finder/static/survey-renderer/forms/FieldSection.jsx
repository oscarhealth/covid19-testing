import {get} from 'lodash';
import React, {useLayoutEffect, useRef} from 'react';
import scrollTo from 'scroll-to';
import {connect} from 'react-redux';
import {change, formValueSelector} from 'redux-form';

import {MarkdownRenderer} from 'survey-renderer/markdown/MarkdownRenderer';
import {useEffect} from 'react';

const SCROLL_DURATION = 500; // ms

const SectionMatcherTypes = {
  contains: 'contains',
  matches: 'matches',
};

function FieldSection({
  change,
  children,
  FieldContainer,
  section,
  formName,
  formValues,
  visibleFieldValues,
  setDisabled,
  index,
}) {
  const showSection = shouldShowSection(formValues, section);
  // Don't update or clear sections that don't have conditions (unconditional or default sections)
  if (section.slug && showSection !== formValues[section.slug]) {
    // Change section status to true/false if visible / hidden.
    change(formName, section.slug, showSection);
    // Clear all dependent values for field to hide further sections / etc.
    if (section.conditions && !showSection) {
      for (const field of section.fields) {
        change(formName, field, null);
      }
    }
  }

  useEffect(() => {
    // When the overall assessment is done, as indicated by certain sections mounting, lock all the questions
    if (showSection && section.slug.startsWith('out')) {
      visibleFieldValues.forEach(() => {
        setDisabled(true);
      });
    }
  }, [section, showSection]);

  const element = useRef(null);
  useLayoutEffect(() => {
    // We do not want to scroll when the first section renders because, on mobile, it may cause the user's screen to
    // scroll past the description at the start.
    if (showSection && index > 0) {
      scrollTo(0, element.current.offsetTop, {
        ease: 'in-cube',
        duration: SCROLL_DURATION,
      });
    }
  }, [showSection]);

  return (
    <div ref={element}>
      {showSection && (
        <React.Fragment>
          {section.showHeader && section.description && (
            <div>
              <MarkdownRenderer value={section.description} />
            </div>
          )}
          {children}
        </React.Fragment>
      )}
    </div>
  );
}

function shouldShowSection(formValues, section) {
  if (!section.conditions) {
    return true;
  }
  for (const condition of section.conditions) {
    if (condition.type === SectionMatcherTypes.contains) {
      if (
        formValues[condition.field] &&
        formValues[condition.field].indexOf(condition.value) !== -1
      ) {
        return true;
      }
    } else if (condition.type === SectionMatcherTypes.matches) {
      if (formValues[condition.field] === condition.value) {
        return true;
      }
    }
  }
  return false;
}

function mapStateToProps(state, ownProps) {
  if (!ownProps.section.conditions) {
    return {};
  }
  const selector = formValueSelector(ownProps.formName);
  const conditionKeys = ownProps.section.conditions.map((condition) => condition.field);

  const visibleFields = Object.keys(get(state, 'form.covidForm.registeredFields', {}));
  const visibleFieldValues = visibleFields.map((fieldName) => {
    return {[fieldName]: state.form.covidForm.values[fieldName]};
  });

  const formValues = Object.keys(get(state, 'form.covidForm.values', {}));

  return {
    formValues: selector(state, ownProps.section.slug, ...conditionKeys),
    visibleFieldValues: visibleFieldValues,
  };
}

const ConnectedFieldSection = connect(mapStateToProps, {change})(FieldSection);

export {ConnectedFieldSection as FieldSection};
