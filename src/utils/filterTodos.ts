import { Todo } from '../types/Todo';
export enum FilterParams {
  ALL = 'all',
  COMPLETED = 'completed',
  ACTIVE = 'active',
}

export const filterTodos = (
  todos: Todo[],
  filterparam: FilterParams,
): Todo[] => {
  return todos.filter(todo => {
    if (filterparam === FilterParams.ACTIVE) {
      return !todo.completed;
    }

    if (filterparam === FilterParams.COMPLETED) {
      return todo.completed;
    }

    return true;
  });
};
