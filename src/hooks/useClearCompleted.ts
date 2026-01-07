import { useCallback } from 'react';
import { Todo, ErrorMessage } from '../types/Todo';
import * as todoService from '../api/todos';

interface UseClearCompletedProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoadingItemIds: React.Dispatch<React.SetStateAction<number[]>>;
  showError: (msg: ErrorMessage) => void;
  hideError: () => void;
  focusInput: () => void;
}

export const useClearCompleted = ({
  todos,
  setTodos,
  setLoadingItemIds,
  showError,
  hideError,
  focusInput,
}: UseClearCompletedProps) => {
  return useCallback(async () => {
    const completed = todos.filter(t => t.completed);

    if (!completed.length) {
      return;
    }

    hideError();
    setLoadingItemIds(prev => [...prev, ...completed.map(t => t.id)]);

    try {
      const results = await Promise.allSettled(
        completed.map(t => todoService.deleteTodo(t.id)),
      );

      const successfulIds = completed
        .filter((_, i) => results[i].status === 'fulfilled')
        .map(t => t.id);

      setTodos(prev => prev.filter(t => !successfulIds.includes(t.id)));

      if (results.some(r => r.status === 'rejected')) {
        showError(ErrorMessage.Delete);
      }
    } finally {
      setLoadingItemIds([]);
      focusInput();
    }
  }, [todos, setTodos, setLoadingItemIds, showError, hideError, focusInput]);
};
