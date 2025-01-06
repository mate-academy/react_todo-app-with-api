import { Dispatch, SetStateAction } from 'react';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TypeTodoList = {
  filteredTodoList: Todo[];
  deletingTodos: number[];
  handleToggleCompletion: (numb: number) => void;
  handleDeleteTodo: (numb: number) => void;
  tempTodo?: Todo | null;
  setTitle: Dispatch<SetStateAction<string>>;
  setTodoList: Dispatch<SetStateAction<Todo[]>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  setLoader: Dispatch<SetStateAction<boolean>>;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  setDeletingTodos: Dispatch<SetStateAction<number[] | []>>;
  
};
