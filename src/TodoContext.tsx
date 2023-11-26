import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Error } from './types/Error';
import { DefaultTypes } from './types/DefaultTypes';
import { TodoStatus } from './types/TodoStatus';

export const USER_ID = 11877;

const defaultValue: DefaultTypes = {
  todos: [],
  setTodos: () => {},
  visibleTodos: [],
  tempTodo: null,
  setTempTodo: () => {},
  inputRef: { current: null },
  error: Error.Empty,
  setError: () => {},
  isClearCompleted: false,
  setIsClearCompleted: () => {},
  isUpdating: false,
  setIsUpdating: () => {},
  toggledTodos: null,
  setToggledTodos: () => {},
  isToggleAllClicked: false,
  setIsToggleAllClicked: () => {},
  isEveryTodoCompleted: false,
  selectedType: TodoStatus.All,
  setSelectedType: () => {},
};

export const TodoContext = React.createContext(defaultValue);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState(Error.Empty);
  const [isClearCompleted, setIsClearCompleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toggledTodos, setToggledTodos] = useState<number | null>(null);
  const [isToggleAllClicked, setIsToggleAllClicked] = useState(false);

  const isEveryTodoCompleted = todos.every(todo => todo.completed);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedType, setSelectedType] = useState(TodoStatus.All);

  const visibleTodos = todos.filter(todo => {
    switch (selectedType) {
      case TodoStatus.Active:
        return !todo.completed;
      case TodoStatus.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  useEffect(() => {
    inputRef.current?.focus();

    getTodos(USER_ID)
      .then((todosFromServer) => {
        setTodos(todosFromServer);
      })
      .catch(() => setError(Error.LoadTodos));
  }, []);

  const value = {
    todos,
    setTodos,
    visibleTodos,
    tempTodo,
    setTempTodo,
    inputRef,
    error,
    setError,
    isClearCompleted,
    setIsClearCompleted,
    isUpdating,
    setIsUpdating,
    toggledTodos,
    setToggledTodos,
    isToggleAllClicked,
    setIsToggleAllClicked,
    isEveryTodoCompleted,
    selectedType,
    setSelectedType,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
