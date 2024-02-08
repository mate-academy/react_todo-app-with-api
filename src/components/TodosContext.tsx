import React, { useEffect, useRef, useState } from 'react';

import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { TodoContextProps } from '../types/TodoContextProps';
import { deleteTodoo, getTodos, updateTodo } from '../api/todos';
import { USER_ID } from '../utils/constants';

export const TodoContext = React
  .createContext<TodoContextProps>({
  todos: [],
  setTodos: () => {},
  activeTodos: [],
  completedTodos: [],
  filter: Status.ALL,
  addTodo: () => {},
  toggleCompleted: () => {},
  toggleAllCompleted: () => {},
  deleteTodo: () => {},
  clearCompleted: () => {},
  updateTodoTitle: async () => {},
  setFilter: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  handlerDeleteCompleted: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  processingIds: [],
  setProcessingIds: () => {},
  inputRef: React.createRef<HTMLInputElement>(),
});

type Props = {
  children: React.ReactNode,
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Status>(Status.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  // const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const addTodo = (todo: Todo) => {
    setTodos([...todos, todo]);
  };

  const deleteTodo = (idTodo: number) => {
    setProcessingIds((prevIds) => [...prevIds, idTodo]);

    deleteTodoo(idTodo)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== idTodo));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setProcessingIds([]);
      });
  };

  const handlerDeleteCompleted = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed).map(todo => todo.id);

    if (completedTodoIds.length === 0) {
      return;
    }

    completedTodoIds.forEach(todoId => {
      deleteTodoo(todoId)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        })
        .catch(() => setErrorMessage('Unable to delete a todo'));
    });
  };

  const toggleCompleted = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setProcessingIds([]);

      return;
    }

    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(prevTodos => prevTodos.map(todo => (todo.id === id
          ? { ...todo, completed: updatedTodo.completed }
          : todo)));
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setProcessingIds([]);
      });
  };

  const toggleAllCompleted = () => {
    if (activeTodos.length !== 0) {
      activeTodos.forEach(todo => toggleCompleted(todo.id));
    } else {
      completedTodos.forEach(todo => toggleCompleted(todo.id));
    }
  };

  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  const updateTodoTitle = () => Promise.resolve();

  const valueTodo: TodoContextProps = {
    todos,
    setTodos,
    activeTodos,
    completedTodos,
    filter,
    addTodo,
    deleteTodo,
    toggleCompleted,
    toggleAllCompleted,
    clearCompleted,
    updateTodoTitle,
    setFilter,
    errorMessage,
    setErrorMessage,
    handlerDeleteCompleted,
    tempTodo,
    setTempTodo,
    processingIds,
    setProcessingIds,
    inputRef,
  };

  return (
    <TodoContext.Provider value={valueTodo}>
      {children}
    </TodoContext.Provider>
  );
};
