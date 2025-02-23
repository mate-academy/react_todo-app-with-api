import { Dispatch, SetStateAction } from 'react';
import { todosService } from '../api/todos';
import { ErrorType } from '../types/ErrorType';
import { Todo } from '../types/Todo';

export const fetchTodos = (
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  handleErrorMessage: (error: ErrorType) => void,
) => {
  todosService
    .getAll()
    .then(setTodos)
    .catch(() => handleErrorMessage(ErrorType.LOAD));
};
