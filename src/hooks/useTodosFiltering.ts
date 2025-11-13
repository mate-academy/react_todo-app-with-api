import { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoStatusFilter } from '../types/TodoStatusFilter';

export const useTodosFiltering = (todos: Todo[]) => {
  const [filter, setFilter] = useState<TodoStatusFilter>(TodoStatusFilter.ALL);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case TodoStatusFilter.COMPLETED:
        return todo.completed;
      case TodoStatusFilter.ACTIVE:
        return !todo.completed;
      case TodoStatusFilter.ALL:
      default:
        return true;
    }
  });

  const allCompleted =
    todos.length > 0 && todos.every(todo => todo.completed === true);
  const someCompleted = todos.some(todo => todo.completed === true);
  const hasTodos = todos.length > 0;

  return {
    filter,
    setFilter,
    filteredTodos,
    allCompleted,
    someCompleted,
    hasTodos,
  };
};
