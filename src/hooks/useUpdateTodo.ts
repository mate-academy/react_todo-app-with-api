import { useCallback } from 'react';
import { Todo, UpdateTodo, ErrorMessage } from '../types/Todo';
import * as todoService from '../api/todos';

interface UseUpdateTodoProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoadingItemIds: React.Dispatch<React.SetStateAction<number[]>>;
  showError: (msg: ErrorMessage) => void;
  hideError: () => void;
  finalizeAction: (idsToRemove?: number[]) => void;
}

export const useUpdateTodo = ({
  setTodos,
  setLoadingItemIds,
  showError,
  hideError,
  finalizeAction,
}: UseUpdateTodoProps) => {
  return useCallback(
    (todo: Todo, type: UpdateTodo, updatedTitle?: string): Promise<void> => {
      hideError();
      setLoadingItemIds(prev => [...prev, todo.id]);

      const sendUpdate = (updatedTodo: Todo) => {
        return todoService
          .updateTodo(updatedTodo)
          .then(() => {
            setTodos(prev =>
              prev.map(t => (t.id === todo.id ? updatedTodo : t)),
            );
          })
          .catch(() => {
            showError(ErrorMessage.Update);
            finalizeAction([todo.id]);

            return Promise.reject(new Error(ErrorMessage.Update));
          })
          .finally(() => finalizeAction([todo.id]));
      };

      if (type === UpdateTodo.Status) {
        const updatedTodo = { ...todo, completed: !todo.completed };

        return sendUpdate(updatedTodo);
      }

      if (type === UpdateTodo.Title) {
        const trimmedTitle = updatedTitle?.trim();

        if (!trimmedTitle) {
          showError(ErrorMessage.TitleValidation);
          finalizeAction([todo.id]);

          return Promise.reject(new Error(ErrorMessage.TitleValidation));
        }

        const updatedTodo = { ...todo, title: trimmedTitle };

        return sendUpdate(updatedTodo);
      }

      return Promise.resolve();
    },
    [setTodos, setLoadingItemIds, showError, hideError, finalizeAction],
  );
};
