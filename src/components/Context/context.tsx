import React, { SetStateAction } from 'react';

type T = (value: SetStateAction<number[]>) => void;

export const setIsLoadingContext = React.createContext<T>(() => {});
