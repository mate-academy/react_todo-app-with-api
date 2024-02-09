/* eslint-disable max-len */
import { Dispatch, SetStateAction } from 'react';
import { Filter } from './enum';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface State {
  todos: Todo[]
  filter: Filter
}

export interface TodoContextProps {
  state: State;
  setState: Dispatch<SetStateAction<State>>;
  handleCheck: (todo: Todo) => void;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  handleDeleteTodo: (todo: Todo) => void;
  deleteAllCompleted: () => void;
  setTodosIsLoading: Dispatch<SetStateAction<number[]>>;
  todosIsLoading: number[];
  handleEditTodo: (todo: Todo, newTitle: string) => void;
  error: string | null;
  isEditing: number | null;
  setIsEditing: Dispatch<SetStateAction<number | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  handleCheckAll: () => void;
}
