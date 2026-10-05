import { useMemo } from 'react';
import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/Filter';

export const useVisibleTodos = (todos: Todo[], filter: FilterStatus) => {
  return useMemo(() => {
    return todos.filter(todo => {
      if (filter === FilterStatus.Active) {
        return !todo.completed;
      }

      if (filter === FilterStatus.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);
};
