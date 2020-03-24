// @flow
import {useCallback, useMemo, useState} from 'react';

export type UseToggleType = {|
  close: () => void,
  isOpen: boolean,
  open: () => void,
  toggle: () => void,
|};

// This hook creates some state for whether something isOpen and returns functions that allow you to toggle the boolean
// This hook can be used with modals
export const useToggle = (initialIsOpen?: boolean = false): UseToggleType => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  return useMemo(() => ({isOpen, open, close, toggle}), [isOpen, open, close, toggle]);
};
