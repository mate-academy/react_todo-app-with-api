import React, {
  ReactNode,
  RefObject,
  createContext,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { Filtering } from '../../types/Filtering';
import { Action, useCustomReducer } from '../UseCustomReducer/useCustomReducer';

interface Reducer {
  state: Todo[];
  filterItems: (filterType: Filtering) => Todo[];
  addItem: (todo: Todo) => void;
  toggle: (id: number) => void;
  remove: (id: number) => void;
  clearCompleted: () => void;
  toggleAll: () => void;
  changeInput: (todo: Todo) => void;
  dispatch: React.Dispatch<Action>;
  fetchData: (arg: Todo[]) => void;
}

export interface MyContextData {
  error: string;
  query: string;
  inputRef: RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  reducer: Reducer;
  loading: number[] | [];
  DeleteAllCompleted: () => void;
  fitlerType: Filtering;
  focusField: () => void;
  handleSetFilterType: (arg: Filtering) => void;
  createTempTodo: (arg: boolean) => void;
  handleSetError: (arg: string) => void;
  handleSetQuery: (arg: string) => void;
  handleSetLoading: (arg: number[]) => void;
}

interface Props {
  children: ReactNode;
}

export const MyContext = createContext<MyContextData | string>('default value');

export const MyProvider: React.FC<Props> = ({ children }) => {
  const [fitlerType, setFilterType] = useState(Filtering.All);
  const [error, setError] = useState<string>('');
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<number[] | []>([]);
  const reducer = useCustomReducer();

  const handleSetError = (e: string) => {
    setError(e);
  };

  const handleSetQuery = (title: string) => {
    setQuery(title);
  };

  const handleSetFilterType = (type: Filtering) => {
    setFilterType(type);
  };

  const handleSetLoading = (arg: number[]) => {
    setLoading([...arg]);
  };

  const createTempTodo = (arg = false) => {
    const obj = { id: 0, title: query, userId: USER_ID, completed: false };

    if (arg) {
      setTempTodo(obj);
    } else {
      setTempTodo(null);
    }
  };

  const focusField = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const values: MyContextData = {
    error,
    query,
    inputRef,
    tempTodo,
    reducer,
    loading,
    fitlerType,
    focusField,
    handleSetLoading,
    createTempTodo,
    handleSetFilterType,
    handleSetError,
    handleSetQuery,
  };

  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};
