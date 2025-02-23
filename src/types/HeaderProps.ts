import { Dispatch, SetStateAction } from 'react';
import { Todo } from './Todo';

export type HeaderProps = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  isLoadingIds: number[];
  setIsLoadingIds: Dispatch<SetStateAction<number[]>>;
};
