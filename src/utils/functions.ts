import { Todo } from '../types/Todo';

export const getCompletedTodos = (todosList: Todo[]) => {
  return todosList.filter(todo => todo.completed);
};

export const getActiveTodos = (todos: Todo[]) => {
  return todos.filter(todo => !todo.completed);
};
