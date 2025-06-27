import { FilterType } from '../constants/FilterType';
import { Todo } from '../types/Todo';
import { filterTodos } from './filterTodos';

export const getTodoStats = (todos: Todo[], filter: FilterType) => {
  const activeTodos = filterTodos(todos, FilterType.Active);
  const completedTodos = filterTodos(todos, FilterType.Completed);
  const visibleTodos = filterTodos(todos, filter);
  const isAllTodosCompleted =
    todos.length > 0 && completedTodos.length === todos.length;

  return {
    activeTodos,
    completedTodos,
    visibleTodos,
    allTodosCount: todos.length,
    activeTodosCount: activeTodos.length,
    completedTodosCount: completedTodos.length,
    isAllTodosCompleted,
  };
};
