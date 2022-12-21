import React, { SetStateAction } from 'react';

type Y = {
  setErrorWithTimer: (message: string) => void,
  loadUserTodos: () => void,
};

export const functonsContext = React.createContext<Y>({
  setErrorWithTimer: () => {},
  loadUserTodos: () => {},
});

type T = (value: SetStateAction<number[]>) => void;

export const setIsLoadingContext = React.createContext<T>(() => {});
