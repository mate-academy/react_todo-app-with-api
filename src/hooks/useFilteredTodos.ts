import { useMemo } from 'react';
import { FilterType } from '../typedefs';
import { getFilteredTodos } from '../helpers';
import { Todo } from '../types/Todo';

interface Options {
  todos: Todo[]
}

export const useFilteredTodos = (options: Options) => {
  const { todos } = options;

  const activeTodos = useMemo(() => (
    getFilteredTodos(todos, FilterType.ACTIVE)
  ), [todos]);

  const completedTodos = useMemo(() => (
    getFilteredTodos(todos, FilterType.COMPLETED)
  ), [todos]);

  return {
    activeTodos,
    completedTodos,
  };
};
