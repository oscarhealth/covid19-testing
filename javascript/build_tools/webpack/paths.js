'use strict';
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

function getAbsolutePath() {
  return path.resolve.apply(this, arguments);
}

function getAbsoluteRootPath() {
  const currentDirPieces = __dirname.split(path.sep);

  /**
   * Looks for a directory that has a package.json
   */
  const hasPackageJson = function() {
    const maybeRoot = path.resolve(currentDirPieces.join(path.sep), 'package.json');
    // Opening files with try/catch is node's recommended pattern, as opposed to checking whether the file exists first.
    try {
      fs.accessSync(maybeRoot);
    } catch (e) {
      return false;
    }

    // fs.accessSync doesn't return a value; it succeeded if it didn't throw
    // an exception.
    return true;
  };

  // Pops off directories until the data path is found.
  while (!hasPackageJson() && currentDirPieces.length) {
    currentDirPieces.pop();
  }

  return currentDirPieces.join(path.sep);
}

module.exports = {
  getAbsolutePath: getAbsolutePath,
  getAbsoluteRootPath: getAbsoluteRootPath,
};
