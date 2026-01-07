import { useCallback } from 'react';
import { Todo, ErrorMessage } from '../types/Todo';
import * as todoService from '../api/todos';

const TEMP_TODO_ID = 0;

interface UseCreateTodoProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setLoadingItemIds: React.Dispatch<React.SetStateAction<number[]>>;
  showError: (msg: ErrorMessage) => void;
  hideError: () => void;
  finalizeAction: (idsToRemove?: number[]) => void;
}

export const useCreateTodo = ({
  setTodos,
  setTitle,
  setTempTodo,
  setLoadingItemIds,
  showError,
  hideError,
  finalizeAction,
}: UseCreateTodoProps) => {
  return useCallback(
    (trimmedTitle: string) => {
      const newTodo: Todo = {
        id: TEMP_TODO_ID,
        userId: todoService.USER_ID,
        title: trimmedTitle,
        completed: false,
      };

      hideError();
      setTempTodo(newTodo);
      setLoadingItemIds(prev => [...prev, TEMP_TODO_ID]);

      todoService
        .createTodo({
          title: trimmedTitle,
          completed: false,
          userId: todoService.USER_ID,
        })
        .then(newTodoFromServer => {
          setTodos(prev => [...prev, newTodoFromServer]);
          setTitle('');
        })
        .catch(() => showError(ErrorMessage.Create))
        .finally(() => {
          setTempTodo(null);
          finalizeAction([TEMP_TODO_ID]);
        });
    },
    [
      setTodos,
      setTitle,
      setTempTodo,
      setLoadingItemIds,
      showError,
      hideError,
      finalizeAction,
    ],
  );
};
