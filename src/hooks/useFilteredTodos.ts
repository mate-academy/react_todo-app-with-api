import { useMemo } from 'react';
import { Todo } from '../types/Todo';
import { Filters } from '../types/Filters';

export const useFilteredTodos = (
  todos: Todo[],
  selectedTodos: Filters,
) => {
  const filteredTodos = useMemo(() => {
    switch (selectedTodos) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);

      case Filters.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, selectedTodos]);

  return filteredTodos;
};
