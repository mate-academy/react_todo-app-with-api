import { useMemo } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

export const useFilterTodos = (todos: Todo[], filter: Filter): Todo[] => {
  return useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
};
