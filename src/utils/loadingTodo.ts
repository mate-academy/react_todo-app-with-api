import { LoadingTodo } from '../types/LoadingTodo';
import { Todo } from '../types//Todo';

export const loadingTodo = (todoList: Todo[]): LoadingTodo => {
  return todoList.reduce((acc: LoadingTodo, todo: Todo): LoadingTodo => {
    return {
      ...acc,
      [todo.id]: todo.id,
    };
  }, {} as LoadingTodo);
};
