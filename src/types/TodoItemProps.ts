import { Dispatch, SetStateAction } from 'react';
import { Todo } from './Todo';

export type TodoItemProps = {
  todo: Todo;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<string>>;
  isLoadingIds: number[];
  setIsLoadingIds: Dispatch<SetStateAction<number[]>>;
};
