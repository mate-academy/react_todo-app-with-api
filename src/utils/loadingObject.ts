import { Loading } from '../types/Loading';
import { Todo } from '../types/Todo';

export const loadingObject = (todos: Todo[]): Loading => {
  return todos.reduce((acc: Loading, todo: Todo): Loading => {
    return {
      ...acc,
      [todo.id]: todo.id,
    };
  }, {} as Loading);
};
