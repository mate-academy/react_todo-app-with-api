import { SetStateAction, createContext } from 'react';
import { Todo } from '../types/Todo';

export interface Props {
  todos: Todo[],
  visibleTodos: Todo[],
  filter: string | null,
  errorMessage: string | null,
  isLoading: boolean,
  todosLoader: boolean,
  isLoadingCompleted: boolean,
  formLoader: boolean,
  tempTodo: Todo | null,
  setTodos: React.Dispatch<SetStateAction<Todo[]>>,
  setVisibleTodos: (visibleTodos:Todo[]) => void,
  setFilter: React.Dispatch<SetStateAction<string | null>>,
  setErrorMessage: React.Dispatch<SetStateAction<string | null>>,
  setIsLoading: (isLoading: boolean) => void,
  setTodosLoader: (todosLoader: boolean) => void,
  setIsLoadingCompleted: (isLoadingCompleted: boolean) => void,
  setFormLoader: (formLoader: boolean) => void,
  setTempTodo: React.Dispatch<SetStateAction<Todo | null>>,
}

export const TodosContext = createContext<Props>({
  todos: [],
  visibleTodos: [],
  filter: '',
  errorMessage: '',
  isLoading: false,
  todosLoader: false,
  isLoadingCompleted: false,
  formLoader: false,
  tempTodo: null,
  setTodos: () => { /* empty */ },
  setVisibleTodos: () => { /* empty */ },
  setFilter: () => { /* empty */ },
  setErrorMessage: () => { /* empty */ },
  setIsLoading: () => { /* empty */ },
  setTodosLoader: () => { /* empty */ },
  setIsLoadingCompleted: () => { /* empty */ },
  setFormLoader: () => { /* empty */ },
  setTempTodo: () => { /* empty */ },
});
