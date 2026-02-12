import { useMemo } from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const useVisibleTodos = (todos: Todo[], filter: FilterType) =>
  useMemo(() => {
    if (filter === FilterType.Active) {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === FilterType.Completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [todos, filter]);
