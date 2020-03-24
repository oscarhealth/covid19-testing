'use strict';

import {sync as globSync} from 'glob';

import * as fs from 'fs';
import path from 'path';

/*
 *
 * npm run lang:build-source
 *
 */

// Aggregates the default messages that were extracted via the React Intl Babel plugin.
// An error will be thrown if there are messages in different components that use the same `id`.
let defaultMessages = globSync(path.join('./.tx/extract/', 'javascript/**/*.json'))
  .map((filename) => fs.readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({id, defaultMessage, description, hiddenContext, maxChar}) => {
      if (collection.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`);
      }

      collection[id] = {defaultMessage, description, maxChar, hiddenContext};
    });
    return collection;
  }, {});

// Sort keys by name
const messageKeys = Object.keys(defaultMessages);
messageKeys.sort();
defaultMessages = messageKeys.reduce((acc, key) => {
  acc[key] = defaultMessages[key];
  console.log(key + ': "' + defaultMessages[key]['defaultMessage'] + '"');
  return acc;
}, {});
