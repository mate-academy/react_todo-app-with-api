import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { Status } from '../../types/Status';
import { getTodos } from '../../api/todos';

const USER_ID = 12130;

interface GlobalContextType {
  userId: number,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  filterBy: Status;
  setFilterBy: React.Dispatch<React.SetStateAction<Status>>;
  errorMessage: Errors | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors | null>>;
  selectedTodosIds: number[];
  setSelectedTodosIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const GlobalContext = React.createContext<GlobalContextType>({
  userId: USER_ID,
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  filterBy: Status.all,
  setFilterBy: () => {},
  errorMessage: null,
  setErrorMessage: () => {},
  selectedTodosIds: [],
  setSelectedTodosIds: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const GlobalContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [filterBy, setFilterBy] = useState(Status.all);
  const [selectedTodosIds, setSelectedTodosIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.loadError));
  }, []);

  const states: GlobalContextType = {
    userId: USER_ID,
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    filterBy,
    setFilterBy,
    errorMessage,
    setErrorMessage,
    selectedTodosIds,
    setSelectedTodosIds,
  };

  return (
    <GlobalContext.Provider value={states}>
      {children}
    </GlobalContext.Provider>
  );
};
