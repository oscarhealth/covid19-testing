'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

/**
 * Returns a list of files matching pattern starting recursively at baseDir.
 *
 * @param {RegEx|[RegEx]} pattern - a regular expression to match against
 *  (or an array of regular expressions)
 * @param {string} baseDir - the base directory to search from
 * @param {RegEx} ignorePrefix - a regular expression that, if matched, will
 *   ignore a given file
 * @param {string} relativeBase - if specified, returned paths will be
 *   relative to this directory
 * @rtype: {Array} Of all the full file paths
 */
function filesMatchingPattern(pattern, baseDir, ignorePrefix, relativeBase, prependDot) {
  let matchedFiles = [];
  const dirStack = [baseDir];
  let currentDir, filesInDir;

  pattern = mergeRegex(pattern);

  while (dirStack.length) {
    currentDir = dirStack.pop();
    filesInDir = fs.readdirSync(currentDir);

    filesInDir.forEach(function(file) {
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory(filePath)) {
        dirStack.push(filePath);
      } else if (stats.isFile() && ((ignorePrefix && !ignorePrefix.test(file))
          || (!ignorePrefix)) && pattern.test(file)) {
        matchedFiles.push(path.resolve(__dirname, filePath));
      }
    });
  }

  if (relativeBase) {
    matchedFiles = matchedFiles.map(function(absPath) {
      let relPath = path.relative(relativeBase, absPath);
      if (prependDot && relPath.indexOf('./') !== 0) {
        // Relative paths have to be prefixed with "./" in order to ensure
        // their resolution by path and not by module name.
        relPath = './' + relPath;
      }
      return relPath;
    });
  }

  return matchedFiles;
}

/**
 * Merge an array of Regexes into one Regex
 *
 * @param {[RegExp]}arrayOfPattern
 * @returns RegExp}
 */

function mergeRegex(arrayOfPattern) {
  if (!(arrayOfPattern instanceof Array)) {
    return arrayOfPattern;
  }

  if (!arrayOfPattern.length) {
    throw Error('No pattern provided');
  }

  if (arrayOfPattern.length === 1) {
    return arrayOfPattern[0];
  }

  const groupedPatterns = _.map(arrayOfPattern, function(pattern) {
    return '(' + pattern.source + ')';
  });

  return new RegExp(groupedPatterns.join('|'));
}

module.exports = {
  filesMatchingPattern: filesMatchingPattern,
};
