import React, { createContext, useContext, useState } from 'react';
import { FilterEnum } from './api/todos';
import { Todo } from './types/Todo';

interface Props {
  children: React.ReactNode;
}

interface ContextProps {
  allTodos: Todo[];
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>;

  editTodoId: number | null;
  setEditTodoId: React.Dispatch<React.SetStateAction<number | null>>;

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  loadingTodoId: number;
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number>>;

  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;

  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;

  updInputText: string;
  setUpdInputText: React.Dispatch<React.SetStateAction<string>>;

  oldText: string;
  setOldText: React.Dispatch<React.SetStateAction<string>>;

  selectedFilter: FilterEnum;
  setSelectedFilter: React.Dispatch<React.SetStateAction<FilterEnum>>;

  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

export const AppContext = createContext<ContextProps | null>(null);

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number>(0);

  const [errorMessage, setErrorMessage] = useState('');

  const [inputText, setInputText] = useState('');
  const [updInputText, setUpdInputText] = useState('');
  const [oldText, setOldText] = useState('');

  const [selectedFilter, setSelectedFilter] = useState(FilterEnum.ALL);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  return (
    <AppContext.Provider
      value={{
        allTodos,
        setAllTodos,
        editTodoId,
        setEditTodoId,
        loading,
        setLoading,
        loadingTodoId,
        setLoadingTodoId,
        errorMessage,
        setErrorMessage,
        inputText,
        setInputText,
        updInputText,
        setUpdInputText,
        oldText,
        setOldText,
        selectedFilter,
        setSelectedFilter,
        tempTodo,
        setTempTodo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): ContextProps => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};
