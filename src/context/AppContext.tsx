import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  MouseEvent,
} from 'react';
import { Filter, Todo } from '../types';

export interface AppContextType {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  selectedFilter: Filter,
  setSelectedFilter: Dispatch<SetStateAction<Filter>>,
  errorMessage: string | null,
  setErrorMessage: Dispatch<SetStateAction<string | null>>,
  visibleTodos: Todo[],
  changeFilter: (event: MouseEvent<HTMLAnchorElement>) => void,
  loadData: () => void,
  tempTodo: Todo | null,
  setTempTodo: Dispatch<SetStateAction<Todo | null>>,
  todosBeingLoaded: number[],
  setTodosBeingLoaded: Dispatch<SetStateAction<number[]>>,
  completedTodosNum: number,
  activeTodosNum: number,
  clearCompleted: () => void,
  toggleAllStatus: () => void,
  removeTodo: (todoId: number) => void,
  changeTodoStatus: (todoId: number, todoStatus: boolean) => void,
  todoInEdit: number | null,
  setTodoInEdit: Dispatch<SetStateAction<number | null>>,
  renameTodo: (todo: Todo, newTitle: string) => void;
}

const AppContextDefault = {
  todos: [],
  setTodos: () => {},
  selectedFilter: 'All' as Filter,
  setSelectedFilter: () => {},
  errorMessage: null,
  setErrorMessage: () => {},
  visibleTodos: [],
  activeTodosNum: 0,
  completedTodosNum: 0,
  changeFilter: () => {},
  loadData: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  todosBeingLoaded: [],
  setTodosBeingLoaded: () => {},
  clearCompleted: () => {},
  toggleAllStatus: () => {},
  removeTodo: () => {},
  changeTodoStatus: () => {},
  todoInEdit: null,
  setTodoInEdit: () => {},
  renameTodo: () => {},
};

export const AppContext = createContext<AppContextType>(AppContextDefault);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};
