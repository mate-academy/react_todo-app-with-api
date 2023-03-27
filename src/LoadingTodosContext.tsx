import React from 'react';

type LoadingTodosContextValue = {
  isLoading: boolean;
  loadingTodosIds: number[];
};

export const LoadingTodosContext = (
  React.createContext<LoadingTodosContextValue>({
    isLoading: false,
    loadingTodosIds: [],
  }));
