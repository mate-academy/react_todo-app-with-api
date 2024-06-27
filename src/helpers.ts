import { Todo } from './types/Todo';

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const getVisibleTodos = (
  generalTodos: Todo[],
  generalFilter: string,
) => {
  if (generalFilter === Filter.Active) {
    return generalTodos.filter(todo => !todo.completed);
  }

  if (generalFilter === Filter.Completed) {
    return generalTodos.filter(todo => todo.completed);
  }

  return generalTodos;
};
