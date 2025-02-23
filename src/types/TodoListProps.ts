import { Dispatch, SetStateAction } from 'react';
import { Todo } from './Todo';

export type TodoListProps = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  tempTodo?: Todo | null;
  setTempTodo?: Dispatch<SetStateAction<Todo | null>>;
  setError: Dispatch<SetStateAction<string>>;
  isLoadingIds: number[];
  setIsLoadingIds: Dispatch<SetStateAction<number[]>>;
};
