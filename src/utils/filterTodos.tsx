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
  const resultTodos = [...todos];

  if (filterparam === FilterParams.ACTIVE) {
    return resultTodos.filter(todo => todo.completed !== true);
  }

  if (filterparam === FilterParams.COMPLETED) {
    return resultTodos.filter(todo => todo.completed === true);
  }

  return resultTodos;
};
