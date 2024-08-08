import { useMemo } from 'react';
import { Todo } from '../types/Todo';

export const useTodosCountByStatus = (todos: Todo[]) => {
  return useMemo(() => {
    const active = todos.filter(({ completed }) => !completed).length;
    const completed = todos.length - active;

    return {
      active,
      completed,
    };
  }, [todos]);
};
