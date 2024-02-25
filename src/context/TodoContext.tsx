import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { Error } from '../types/ErrorMessage';
import { getTodos } from '../api/todos';
import { wait } from '../utils/fetchClient';
import { USER_ID } from '../types/userId';

type ContextProps = {
  todos: Todo[];
  filter: Status;
  tempTodo: Todo | null;
  errorMessage: Error | null;
  updatingIds: number[];
  addTodo: (newTodo: Todo) => void;
  deleteTodo: (todoId: number) => void;
  updateTodo: (todo: Omit<Todo, 'userId'>) => void;
  setTempTodo: (newTodo: Todo | null) => void;
  setErrorMessage: (newError: Error) => void;
  SetUpdatingIds: (id: number | null) => void;
  setFilter: (newStatus: Status) => void;
};

export const TodoContext = React.createContext<ContextProps>({
  todos: [],
  filter: Status.all,
  tempTodo: null,
  errorMessage: Error.none,
  updatingIds: [],
  addTodo: () => {},
  deleteTodo: () => {},
  updateTodo: () => {},
  setTempTodo: () => {},
  setErrorMessage: () => {},
  SetUpdatingIds: () => {},
  setFilter: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [filter, setFilter] = useState(Status.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingIds, setUpdatingIds] = useState<number[] | []>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.todosLoading);

        return wait(3000).then(() => setErrorMessage(null));
      });
  }, []);

  useEffect(() => {
    wait(3000).then(() => setErrorMessage(Error.none));
  }, [errorMessage]);

  const addTodo = useCallback(
    (newTodo: Todo) => {
      setTodos(currentTodos => [...currentTodos, newTodo]);
    },
    [setTodos],
  );

  const deleteTodo = useCallback(
    (todoId: number) => {
      setTodos(currentTodos =>
        currentTodos.filter(todo => {
          return todo.id !== todoId;
        }),
      );
    },
    [setTodos],
  );

  const updateTodo = useCallback(
    ({ title, id, completed }: Omit<Todo, 'userId'>) => {
      setTodos(currentTodos =>
        currentTodos.map(currentTodo => {
          return currentTodo.id !== id
            ? currentTodo
            : { ...currentTodo, title, completed };
        }),
      );
    },
    [setTodos],
  );

  const SetUpdatingIds = (id: number | null) => {
    if (id) {
      setUpdatingIds(currentIds => [...currentIds, id]);
    } else {
      setUpdatingIds([]);
    }
  };

  const todosValue = {
    todos,
    filter,
    tempTodo,
    errorMessage,
    updatingIds,
    addTodo,
    deleteTodo,
    updateTodo,
    setErrorMessage,
    setTempTodo,
    SetUpdatingIds,
    setFilter,
  };

  return (
    <TodoContext.Provider value={todosValue}>{children}</TodoContext.Provider>
  );
};
