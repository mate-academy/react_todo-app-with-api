/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useEffect, useState } from 'react';
import { Context, ContextKey, ContextState } from './types/Context';
import { FilterType } from './types/FilterType';
import { getTodos } from './api/todos';
import { ErrorType } from './types/ErrorType';
import { Todo } from './types/Todo';

export const USER_ID = 12017;

const initialState: ContextState = {
  selectedFilter: FilterType.All,
  errorMsg: null,
  tempTodo: null,
  globalLoading: false,
};

interface Props {
  children: React.ReactNode;
}

export const AppContext = createContext<Context>({
  state: initialState,
  todosFromServer: [],
  toggleAllActive: false,
  changeState<T>(field: ContextKey, value: T) {},
  errorFound: (error: ErrorType) => {},
  setTodosFromServer: () => {},
});

export const AppContextProvider = ({ children }: Props) => {
  const [state, setState] = useState<ContextState>(initialState);
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);

  function changeState<T>(field: ContextKey, value: T) {
    setState((prevState: ContextState) => ({
      ...prevState,
      [field]: value,
    }));
  }

  const errorFound = (error: ErrorType) => {
    changeState(ContextKey.ErrorMsg, error);
    setTimeout(() => changeState(ContextKey.ErrorMsg, null), 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => changeState(ContextKey.ErrorMsg, ErrorType.TodosNotLoaded));
  }, []);

  const toggleAllActive = todosFromServer.every(todo => todo.completed);

  return (
    <AppContext.Provider
      value={{
        state,
        todosFromServer,
        toggleAllActive,
        changeState,
        errorFound,
        setTodosFromServer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
