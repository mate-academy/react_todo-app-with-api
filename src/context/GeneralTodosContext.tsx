import React from 'react';
import {
  FilterTodosContextProvider,
  LoadingTodosContextProvider,
  TodosContextProvider,
} from './TodosContexts';

type Props = {
  children: React.ReactNode
};

export const GeneralTodosContext: React.FC<Props> = ({ children }) => (
  <FilterTodosContextProvider>
    <LoadingTodosContextProvider>
      <TodosContextProvider>
        {children}
      </TodosContextProvider>
    </LoadingTodosContextProvider>
  </FilterTodosContextProvider>
);
