import React from 'react';

type LoadingTodosContextValue = {
  loadingTodosIds: number[];
};

export const LoadingTodosContext = (
  React.createContext<LoadingTodosContextValue>({
    loadingTodosIds: [],
  }));
