import { Dispatch, SetStateAction } from 'react';

import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { ErrorMessages } from '../enum/ErrorMessages';

export const deleteTodoInTodoList = async (
  id: number,
  setTodoLoading: (id: number, loading: boolean) => void,
  setErrorMessage: (message: ErrorMessages) => void,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
) => {
  try {
    setTodoLoading(id, true);
    setErrorMessage(ErrorMessages.none);
    await deleteTodo(id);

    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
  } catch (error) {
    setErrorMessage(ErrorMessages.delete);
    throw error;
  } finally {
    setTodoLoading(id, false);
  }
};
