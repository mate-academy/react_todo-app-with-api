import React, { createContext } from 'react';

type Context = {
  hasLoadingError: boolean,
  setHasLoadingError: React.Dispatch<React.SetStateAction<boolean>>,
  isTogglingErrorShown: boolean,
  setIsTogglingErrorShown: React.Dispatch<React.SetStateAction<boolean>>,
  isRemoveErrorShown: boolean,
  setIsRemoveErrorShown: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEmptyTitleErrorShown: React.Dispatch<React.SetStateAction<boolean>>,
  isEmptyTitleErrorShown: boolean,
  isAddingErrorShown: boolean,
  setIsAddingErrorShown: React.Dispatch<React.SetStateAction<boolean>>,
};

export const ErrorContext = createContext<Context>({
  hasLoadingError: false,
  setHasLoadingError: (): void => {},
  isTogglingErrorShown: false,
  setIsTogglingErrorShown: (): void => {},
  isRemoveErrorShown: false,
  setIsRemoveErrorShown: (): void => {},
  isEmptyTitleErrorShown: false,
  setIsEmptyTitleErrorShown: (): void => {},
  isAddingErrorShown: false,
  setIsAddingErrorShown: (): void => {},
});
