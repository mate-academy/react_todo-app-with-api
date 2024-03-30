import React, { useEffect, useMemo, useState } from 'react';
import { Status } from '../types/Status';
import { TodoContextType } from '../types/TodoContext';
import { Todo } from '../types/Todo';
import { USER_ID } from '../constants/user';
import { getTodos } from '../api/todos';
import { Error } from '../types/Error';
import { prepareTodos } from '../services/prepareTodos';

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  filteredTodos: [],
  filterField: Status.All,
  updatingTodosIds: [],
  errorMessage: '',
  tempTodo: null,
  addTodo: () => { },
  deleteTodo: () => { },
  updateTodo: () => { },
  handleFilterField: () => { },
  handleUpdatingTodosIds: () => { },
  handleError: () => { },
  handleSetTempTodo: () => { },
});

interface Props {
  children: React.ReactNode
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterField, setFilterField] = useState<Status>(Status.All);
  const [updatingTodosIds, setUpdatingTodosIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos = prepareTodos(todos, filterField);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.Load);
      });
  }, []);

  const addTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => (
      prevTodos.filter(todo => todo.id !== id)
    ));
  };

  const updateTodo = ({
    id,
    title,
    completed,
  }: Omit<Todo, 'userId'>) => {
    setTodos(prevTodos => (
      prevTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, title, completed };
        }

        return todo;
      })
    ));
  };

  const handleFilterField = (status: Status) => {
    setFilterField(status);
  };

  const handleUpdatingTodosIds = (id: number | null) => {
    if (id) {
      setUpdatingTodosIds(prevTodosIds => [...prevTodosIds, id]);
    } else {
      setUpdatingTodosIds([]);
    }
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  const handleSetTempTodo = (todo: Todo | null) => {
    setTempTodo(todo);
  };

  const todoValues = useMemo(() => ({
    todos,
    filteredTodos,
    filterField,
    updatingTodosIds,
    errorMessage,
    tempTodo,
    addTodo,
    deleteTodo,
    updateTodo,
    handleFilterField,
    handleUpdatingTodosIds,
    handleError,
    handleSetTempTodo,
  }), [
    todos,
    filteredTodos,
    filterField,
    updatingTodosIds,
    errorMessage,
    tempTodo,
  ]);

  return (
    <TodoContext.Provider value={todoValues}>
      {children}
    </TodoContext.Provider>
  );
};
