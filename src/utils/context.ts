import { Dispatch, SetStateAction, createContext } from 'react';
import { Todo } from '../types/Todo';
import { TodoError } from '../types/enums/TodoError';

interface TodosContextType {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;

  isErrorVisible: boolean;
  setIsErrorVisible: (a: boolean) => void;

  errorMessage: TodoError;
  setErrorMessage: Dispatch<SetStateAction<TodoError>>;

  todosIdsWithActiveLoader: number[];
  setTodosIdsWithActiveLoader: React.Dispatch<React.SetStateAction<number[]>>;
}

const defaultTodosContext: TodosContextType = {
  todos: [],
  setTodos: () => {},

  isErrorVisible: false,
  setIsErrorVisible: () => {},

  errorMessage: TodoError.Default,
  setErrorMessage: () => {},

  todosIdsWithActiveLoader: [],
  setTodosIdsWithActiveLoader: () => {},
};

export const TodosContext =
  createContext<TodosContextType>(defaultTodosContext);
