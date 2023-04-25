import { useMemo } from 'react';
import { Sort } from '../types/Sort';

export const useSort = (todos, sort) => {
  const modifiedTodos = useMemo(() => {
    return (todos
      .filter(todo => {
        switch (sort) {
          case Sort.Active:
            return !todo.completed;
          case Sort.Completed:
            return todo.completed;
          case Sort.All:
          default:
            return true;
        }
      })
    );
  }, [todos, sort]);

  return modifiedTodos;
};
