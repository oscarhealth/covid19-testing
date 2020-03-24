// @flow
import {escapeRegExp} from 'lodash';
import React from 'react';
/* eslint-disable local/use-emdash */

/**
 * Returns a portion of `name` from `start` to `end`
 */
const getSpan = (name, start, end, highlight, className) => {
  if (highlight) {
    const key = `${start}-${end}`;
    return (
      <span className={className} key={key}>
        {name.slice(start, end)}
      </span>
    );
  }
  return name.slice(start, end);
};

/**
 * Returns a spec for a highlighted portion of a string
 */
const getHighlightSpec = (start, end) => {
  return {start, end, highlight: true};
};

/**
 * Returns a spec for a non highlighted portion of a string
 */
const getNonHighlightSpec = (start, end) => {
  return {start, end, highlight: false};
};

/**
 * Returns a list of objects defining a start, end, and whether that section should be highlighted.
 * This list covers all characters in the string. If the highlight definitions are invalid, then
 * an empty list is returned
 *
 * @param highlights A list containing highlights defined by beginning and ending offsets
 * @param totalLength The total length of the string receiving highlights
 */
const createHighlightSpec = (highlights, totalLength) => {
  let spec = [];
  let highlight;
  let lastHighlightedIndex = 0;
  let valid = true;

  for (let i = 0; i < highlights.length; i++) {
    highlight = highlights[i];
    if (lastHighlightedIndex !== highlight.beginOffset) {
      spec.push(getNonHighlightSpec(lastHighlightedIndex, highlight.beginOffset));
    }
    // This would only happen in an overlap
    if (highlight.beginOffset < lastHighlightedIndex) {
      valid = false;
      break;
    }
    spec.push(getHighlightSpec(highlight.beginOffset, highlight.endOffset));
    lastHighlightedIndex = highlight.endOffset;
  }
  // If we have left over letters, add them as non highlighted
  if (lastHighlightedIndex < totalLength) {
    spec.push(getNonHighlightSpec(lastHighlightedIndex, totalLength));
  } else if (lastHighlightedIndex > totalLength) {
    valid = false;
  }

  if (!valid) {
    spec = [];
  }
  return spec;
};

type Offsets = {
  beginOffset: number,
  endOffset: number,
};

const Highlight = {
  /**
   * Returns a React DOM element containing highlights.
   */
  getHighlightedElement(str: string, highlightsList?: Offsets[], className?: string) {
    let output = str;
    if (highlightsList && className) {
      // TODO: Replace with lodash once it can be required safely.
      const highlights = highlightsList
        .concat()
        .sort((a, b) => a.beginOffset - b.beginOffset);

      const highlightSpecs = createHighlightSpec(highlights, str.length);
      // If highlightSpecs is an empty list there were no highlights, or
      // something was not valid
      if (highlightSpecs.length) {
        output = highlightSpecs.map(function(spec) {
          return getSpan(str, spec.start, spec.end, spec.highlight, className);
        });
      }
    }
    return <span>{output}</span>;
  },

  /**
   * Returns a React DOM element containing highlights.
   */
  getSubstringHighlightedElement(str: string, substr: string, className: string) {
    if (!substr) {
      return <span>{str}</span>;
    }
    const index = str.toLowerCase().indexOf(substr.toLowerCase());
    if (index === -1) {
      return <span>{str}</span>;
    }

    return this.getHighlightedElement(
      str,
      [{beginOffset: index, endOffset: index + substr.length}],
      className
    );
  },

  // TODO: Upgrade React, or re-write with usable js features in current node version.
  /**
   * Performs a case-insensitive search within a string for each term in the list, each time a term
   * is found, it is wrapped in a span with the given class name. All instances of a term are highlighted.
   * Partials are ignored (i.e. if your term is "man" and the string is "woman", it will not be highlighted.
   *
   * Note: This takes a different approach than the functions above, but is located here
   * to centralize solutions and maximize discoverability.
   */
  highlightTerms(str: string, terms: string[], className: string) {
    const sortedTerms = terms
      .map((term) => escapeRegExp(term))
      .sort((a, b) => b.length - a.length);

    const els = [];
    const highlightRegex = new RegExp(
      `\\b(?<!-)(${sortedTerms.join('|')})(?=\\W|$)(?!-)`,
      'i'
    );

    function iterate(remainingStr) {
      if (!remainingStr) {
        return;
      }

      const matchResult = remainingStr.match(highlightRegex);
      if (!matchResult) {
        els.push(remainingStr);
        return;
      }

      const [fullMatch, match] = matchResult;
      const offset = fullMatch.indexOf(match);

      const beforeIndex = remainingStr.slice(0, matchResult.index + offset);
      const afterIndex = remainingStr.slice(matchResult.index + offset + match.length);

      els.push(beforeIndex);
      els.push(
        <span className={className} key={`${match}-${els.length}`}>
          {match}
        </span>
      );

      iterate(afterIndex);
    }

    iterate(str);
    return <span>{els}</span>;
  },
};

export {Highlight};
