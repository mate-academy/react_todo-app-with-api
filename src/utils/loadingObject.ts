import { Loading, Todo } from '../types';

export const loadingObject = (todos: Todo[]): Loading => {
  return todos.reduce((acc: Loading, todo: Todo): Loading => {
    return {
      ...acc,
      [todo.id]: todo.id,
    };
  }, {} as Loading);
};
