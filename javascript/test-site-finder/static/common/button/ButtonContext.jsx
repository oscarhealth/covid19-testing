// @flow
import React from 'react';

export type ButtonContextType = ?{
  buttonSize: string,
  buttonType: string,
  isIconButton: boolean,
};

export const ButtonContext = React.createContext<ButtonContextType>(null);
