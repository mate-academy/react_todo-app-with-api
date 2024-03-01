import React, { createContext, useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoContext } from '../types/TodosContext';
import { getTodos } from '../api/todos';
import { Status } from '../types/Status';
import { USER_ID } from '../constants/constants';

export const TodosContext = createContext<TodoContext>({
  todos: [],
  setTodos: () => {},
  title: '',
  setTitle: () => {},
  filterBy: Status.All,
  setFilterBy: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  editedTodos: [],
  setEditedTodos: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [filterBy, setFilterBy] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editedTodos, setEditedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const preparedValue = useMemo(
    () => ({
      todos,
      setTodos,
      title,
      setTitle,
      filterBy,
      setFilterBy,
      errorMessage,
      setErrorMessage,
      tempTodo,
      setTempTodo,
      editedTodos,
      setEditedTodos,
    }),
    [todos, title, filterBy, setTodos, errorMessage, tempTodo, editedTodos],
  );

  return (
    <TodosContext.Provider value={preparedValue}>
      {children}
    </TodosContext.Provider>
  );
};
