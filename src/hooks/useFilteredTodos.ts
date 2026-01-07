import { useMemo } from 'react';
import { Todo, FilterBy } from '../types/Todo';

export const useFilteredTodos = (todos: Todo[], filterBy: FilterBy) => {
  return useMemo(() => {
    const active = todos.filter(todo => !todo.completed);

    return {
      visibleTodos:
        filterBy === FilterBy.All
          ? todos
          : filterBy === FilterBy.Active
            ? active
            : todos.filter(todo => todo.completed),
      activeTodosAmount: active.length,
      completedTodosAmount: todos.length - active.length,
    };
  }, [todos, filterBy]);
};
