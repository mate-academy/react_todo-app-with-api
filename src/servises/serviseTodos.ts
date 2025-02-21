import { FilterNav } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getFiltredTodos = (todos: Todo[], filter: FilterNav) => {
  return todos.filter(todo => {
    if (filter === FilterNav.Active) {
      return !todo.completed;
    }

    if (filter === FilterNav.Completed) {
      return todo.completed;
    }

    return true;
  });
};

export const findTodo = (todoId: number, todos: Todo[]) => {
  return todos.find(todo => todo.id === todoId);
};
