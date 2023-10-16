import React, { useReducer, useState } from 'react';

import { Todo } from '../../types/Todo';
import { Action } from '../../types/Action';
import { Status } from '../../types/Status';

import { todosReducer } from '../../utils/todosReducer';

type Context = {
  todos: Todo[],
  dispatch: React.Dispatch<Action>,
  currentFilter: Status,
  setCurrentFilter: React.Dispatch<Status>,
  errorMessage: string,
  setErrorMessage: React.Dispatch<string>,
  errorId: number,
  setErrorId: React.Dispatch<number>,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<Todo | null>,
  clearAllIds: number[],
  setClearAllIds: React.Dispatch<number[]>,
  toggledIds: number[],
  setToggledIds: React.Dispatch<number[]>,
};

const initialContext: Context = {
  todos: [],
  dispatch: () => {},
  currentFilter: Status.All,
  setCurrentFilter: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  errorId: 0,
  setErrorId: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  clearAllIds: [],
  setClearAllIds: () => {},
  toggledIds: [],
  setToggledIds: () => {},
};

export const TodosContext = React.createContext<Context>(initialContext);

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const [currentFilter, setCurrentFilter] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [clearAllIds, setClearAllIds] = useState<number[]>([]);
  const [toggledIds, setToggledIds] = useState<number[]>([]);
  const [errorId, setErrorId] = useState(0);

  return (
    <TodosContext.Provider value={{
      todos,
      dispatch,
      currentFilter,
      setCurrentFilter,
      errorMessage,
      setErrorMessage,
      errorId,
      setErrorId,
      tempTodo,
      setTempTodo,
      clearAllIds,
      setClearAllIds,
      toggledIds,
      setToggledIds,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
