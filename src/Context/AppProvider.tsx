import React from 'react';

import { ApiErrorProvider } from './ApiErrorProvider/ApiErrorProvider';
import { FormFocusProvider } from './FormFocusProvider/FormFocusProvider';
import { TodosProvider } from './TodosContext/TodosProvider';

type Props = {
  children: React.ReactNode,
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  return (
    <FormFocusProvider>
      <ApiErrorProvider>
        <TodosProvider>
          {children}
        </TodosProvider>
      </ApiErrorProvider>
    </FormFocusProvider>
  );
};
