import { FilteringMethod } from '../types/FilteringStatus';
import { Todo } from '../types/Todo';

export const emptyFunction = (x: number) => x;

export const getVisibleTodos = (
  todos: Todo[],
  filteringMethod: FilteringMethod,
): Todo[] => {
  switch (filteringMethod) {
    case FilteringMethod.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case FilteringMethod.COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export type CountPerStatus = {
  active: number,
  completed: number,
};

export const getCountPerStatus = (
  todos: Todo[],
): CountPerStatus => {
  return todos.reduce((countObj, todo) => {
    const updatedCount = todo.completed
      ? { completed: countObj.completed + 1 }
      : { active: countObj.active + 1 };

    return {
      ...countObj,
      ...updatedCount,
    };
  }, {
    active: 0,
    completed: 0,
  });
};
