import { Todo } from '../types/Todo';

export enum FilterLink {
  All = '',
  Active = 'active',
  Completed = 'completed',
}

export function preparedTodos(
  arr: Todo[],
  option: string,
) {
  const todos = [...arr];

  if (option) {
    switch (option) {
      case FilterLink.Active: {
        return todos.filter(todo => !todo.completed);
      }

      case FilterLink.Completed: {
        return todos.filter(todo => todo.completed);
      }

      default: {
        return todos;
      }
    }
  }

  return todos;
}
