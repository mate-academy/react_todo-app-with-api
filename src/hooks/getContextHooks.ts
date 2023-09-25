import { useContext } from 'react';

import { TodosContext } from '../Context/TodosContext/TodosProvider';
import { ApiErrorContext } from '../Context/ApiErrorProvider/ApiErrorProvider';
import { FormFocusContext }
  from '../Context/FormFocusProvider/FormFocusProvider';

export const useTodosContext = () => useContext(TodosContext);

export const useApiErrorContext = () => useContext(ApiErrorContext);

export const useFormFocusContext = () => useContext(FormFocusContext);
