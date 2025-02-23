import { Todo, FilterType } from '../types';

export const getFilteredTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  const visibleTodos = [...todos];

  switch (filter) {
    case FilterType.ACTIVE:
      return visibleTodos.filter(todo => !todo.completed);
    case FilterType.COMPLETED:
      return visibleTodos.filter(todo => todo.completed);
    default:
      return visibleTodos;
  }
};
