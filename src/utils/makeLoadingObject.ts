import { LoadingType, Todo } from '../types';

export const makeLoadingObject = (todos: Todo[]): LoadingType => {
  return todos.reduce((acc: LoadingType, todo: Todo): LoadingType => {
    return {
      ...acc,
      [todo.id]: todo.id,
    };
  }, {} as LoadingType);
};
