// @flow

export const CONTAINED_GROUP_POSITION = {
  LEFT_CHILD: 'LEFT_CHILD',
  MIDDLE_CHILD: 'MIDDLE_CHILD',
  RIGHT_CHILD: 'RIGHT_CHILD',
  TOP_CHILD: 'TOP_CHILD',
  BOTTOM_CHILD: 'BOTTOM_CHILD',
};

export const AnatomySizes = {
  XSMALL: 'xsmall',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

export const Buttons = {
  'primary': 'primary',
  'neutral': 'neutral',
  'destructive': 'destructive',
  'knocked-out': 'knocked-out',
};

export const Natives = {
  button: 'button',
  submit: 'submit',
  reset: 'reset',
};

export type SizeType = $Keys<typeof AnatomySizes>;

export type ButtonType = $Keys<typeof Buttons>;

export type NativeType = $Keys<typeof Natives>;

export type GroupPositionType = $Keys<typeof CONTAINED_GROUP_POSITION>;

