// @flow
import {uniqueId} from 'lodash';
import slug from 'slug';

// makeUniqueId creates an ID suitable for identifying an HTML element.
// IDs are unique to the current execution context.
// To automatically provide a unique ID to your React component, use the
// UniqueFieldIs higher order component.
export default function makeUniqueId(label: ?string): string {
  const prefix = label ? slug(label.toLowerCase()) : 'unnamed';

  // eslint-disable-next-line local/use-emdash
  return uniqueId(`${prefix}-`);
}
