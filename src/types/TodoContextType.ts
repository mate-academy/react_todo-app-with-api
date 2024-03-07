import { Todo } from './Todo';
import { TypeOfFiltering } from './TypeOfFiltering';
import { ErrorType } from './ErrorType';

export interface TodoContextType {
  todos: Todo[];
  tempTodo: Todo | null;
  filterType: TypeOfFiltering;
  changeData: (
    id: number,
    title: string,
    completed: boolean,
  ) => void;
  deleteData: (id: number) => void;
  setFilterType: (x: TypeOfFiltering) => void;
  dataError: ErrorType | string;
  setError: (x: ErrorType | '') => void;
  Error: (error: ErrorType) => void;
  addTodo: (value: string) => void;
  editTodo: number;
  setEditTodo: (id: number) => void;
  changeTodo: (id: number, title: string, completed: boolean) => void;
  activeLoader: number[];
  shouldFocus: boolean;
  setInputValue: (value: string) => void,
  inputValue: string,
  setTodos: (todos: Todo[]) => void,
}
