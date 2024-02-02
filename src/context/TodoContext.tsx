import React, { useEffect, useMemo, useState } from 'react';
import { Status } from '../types/Status';
import { TodoContextType } from '../types/TodoContext';
import { Todo } from '../types/Todo';
import { getFilteredTodos } from '../services/getFilteredTodos';
import { getTodos } from '../api/todos';
import { USER_ID } from '../constants/user';

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  filteredTodos: [],
  tempTodo: null,
  errorMessage: '',
  updatingTodosIds: [],
  addNewTodo: () => { },
  deleteTodo: () => { },
  updateTodo: () => { },
  filter: Status.All,
  handleFilter: () => { },
  handleUpdatingTodosIds: () => { },
  handleError: () => { },
  handleSetTempTodo: () => { },
});

interface Props {
  children: React.ReactNode
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [updatingTodosIds, setUpdatingTodosIds] = useState<number[]>([]);

  const filteredTodos = getFilteredTodos(filter, todos);

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const addNewTodo = (newTodo: Todo) => {
    setTodos(prev => [...prev, newTodo]);
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => (
      prev.filter(todo => todo.id !== id)
    ));
  };

  const updateTodo = ({
    title,
    completed,
    id,
  }: Omit<Todo, 'userId'>) => {
    setTodos(prev => (
      prev.map(todo => {
        if (todo.id === id) {
          return { ...todo, title, completed };
        }

        return todo;
      })
    ));
  };

  const handleFilter = (status: Status) => {
    setFilter(status);
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  const handleUpdatingTodosIds = (id: number | null) => {
    if (id) {
      setUpdatingTodosIds(prev => [...prev, id]);
    } else {
      setUpdatingTodosIds([]);
    }
  };

  const handleSetTempTodo = (todo: Todo | null) => {
    setTempTodo(todo);
  };

  const todosValue = useMemo(() => ({
    todos,
    filteredTodos,
    filter,
    tempTodo,
    errorMessage,
    updatingTodosIds,
    addNewTodo,
    deleteTodo,
    updateTodo,
    handleFilter,
    handleUpdatingTodosIds,
    handleError,
    handleSetTempTodo,
  }), [
    todos,
    filteredTodos,
    filter,
    tempTodo,
    errorMessage,
    updatingTodosIds,
  ]);

  return (
    <TodoContext.Provider value={todosValue}>
      {children}
    </TodoContext.Provider>
  );
};
