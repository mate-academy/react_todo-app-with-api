import React, { useEffect, useMemo, useState } from 'react';
import { Filter } from '../types/Filter';
import { getTodosApi } from '../api/todos';
import { UNABLE_LOAD_ERROR } from '../constants/errors';
import { Todo } from '../types/Todo';
import { TodoContextType } from '../types/TodoContext';

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  filter: Filter.All,
  updatingTodosIds: [],
  errorMessage: '',
  tempTodo: null,
  addTodoHandler: () => {},
  deleteTodoHandler: () => {},
  updateTodoHandler: () => {},
  setFilterHandler: () => {},
  setUpdatingTodosIdsHandler: () => {},
  setErrorHandler: () => {},
  setTempTodoHandler: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [updatingTodosIds, setUpdatingTodosIds] = useState<number[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodosApi()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(UNABLE_LOAD_ERROR);
      });
  }, []);

  const addTodoHandler = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const deleteTodoHandler = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const updateTodoHandler = ({
    id,
    title,
    completed,
  }: Omit<Todo, 'userId'>) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, title, completed };
        }

        return todo;
      }),
    );
  };

  const setFilterHandler = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  const setUpdatingTodosIdsHandler = (id: number | null) => {
    if (id) {
      setUpdatingTodosIds(prevTodosIds => [...prevTodosIds, id]);
    } else {
      setUpdatingTodosIds([]);
    }
  };

  const setErrorHandler = (error: string) => {
    setErrorMessage(error);
  };

  const setTempTodoHandler = (todo: Todo | null) => {
    setTempTodo(todo);
  };

  const todoValues = useMemo(
    () => ({
      todos,
      filter,
      updatingTodosIds,
      errorMessage,
      tempTodo,
      addTodoHandler,
      deleteTodoHandler,
      updateTodoHandler,
      setFilterHandler,
      setUpdatingTodosIdsHandler,
      setErrorHandler,
      setTempTodoHandler,
    }),
    [todos, filter, updatingTodosIds, errorMessage, tempTodo],
  );

  return (
    <TodoContext.Provider value={todoValues}>{children}</TodoContext.Provider>
  );
};
