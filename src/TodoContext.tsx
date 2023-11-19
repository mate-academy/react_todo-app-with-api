import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';
import { DefaultValue } from './types/DefaultValue';
import { Status } from './types/Status';

export const USER_ID = 11819;

const defaultValue: DefaultValue = {
  todos: [],
  setTodos: () => {},
  visibleTodos: [],
  tempTodo: null,
  setTempTodo: () => {},
  inputRef: { current: null },
  error: ErrorMessage.Empty,
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
  selectedType: Status.All,
  setSelectedType: () => {},
};

export const TodoContext = React.createContext(defaultValue);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState(ErrorMessage.Empty);
  const [isClearCompleted, setIsClearCompleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toggledTodos, setToggledTodos] = useState<number | null>(null);
  const [isToggleAllClicked, setIsToggleAllClicked] = useState(false);

  const isEveryTodoCompleted = todos.every(todo => todo.completed);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedType, setSelectedType] = useState(Status.All);

  const visibleTodos = todos.filter(todo => {
    switch (selectedType) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
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
      .catch(() => setError(ErrorMessage.LoadTodos));
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
