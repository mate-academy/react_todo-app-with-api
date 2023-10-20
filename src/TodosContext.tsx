import React, { useEffect, useState } from 'react';
import { Context } from './types/Context';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 11690;

export const TodosContext = React.createContext<Context>({
  todos: [],
  tempTodo: null,
  addTodo: () => {},
  deleteTodo: () => {},
  updateTodo: async () => {},
  toggleAll: () => {},
  setError: () => {},
  errorMessage: ErrorMessage.none,
  toggleTodo: () => {},
  getFilteredTodos: () => [],
  clearCompleted: () => {},
  todoCount: 0,
  statusResponse: false,
  title: '',
  setTitle: () => {},
  isUpdating: [],
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.none);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [statusResponse, setStatusResponse] = useState(false);
  const [isUpdating, setIsUpdating] = useState<number[]>([]);

  function setError(message: ErrorMessage) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(ErrorMessage.none);
    }, 3000);
  }

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessage.load);
      });
  }, []);

  const getFilteredTodos = (filterType: Filter) => {
    let preparedTodos = [...todos];

    if (filterType !== Filter.ALL) {
      preparedTodos = preparedTodos.filter(todo => {
        switch (filterType) {
          case Filter.ACTIVE:
            return !todo.completed;

          case Filter.COMPLETED:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    return preparedTodos;
  };

  function addTodo() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.title);

      return;
    }

    const data = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...data,
    });

    setStatusResponse(true);

    todosService.createTodo(data)
      .then(newTodo => {
        setTitle('');
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setError(ErrorMessage.add);
      })
      .finally(() => {
        setTempTodo(null);
        setStatusResponse(false);
      });
  }

  const deleteTodo = (todoId: number) => {
    setStatusResponse(true);
    setIsUpdating(current => [
      ...current,
      todoId,
    ]);

    todosService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
        setStatusResponse(false);
      })
      .catch(() => {
        setError(ErrorMessage.delete);
      })
      .finally(() => {
        setIsUpdating(current => current.filter(id => id !== todoId));
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setIsUpdating(current => [
      ...current,
      updatedTodo.id,
    ]);

    return todosService
      .updateTodo(updatedTodo)
      .then(() => {
        setTodos((currentTodo) => currentTodo
          .map((todo) => (todo.id === updatedTodo.id
            ? updatedTodo
            : todo)));
      })
      .catch((error) => {
        setError(ErrorMessage.update);
        throw error;
      })
      .finally(() => {
        setIsUpdating(current => current.filter(id => id !== updatedTodo.id));
      });
  };

  function toggleTodo(todo: Todo) {
    const { completed } = todo;

    const newTodo = {
      ...todo,
      completed: !completed,
    };

    updateTodo(newTodo);
  }

  async function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));
  }

  const todoCount = todos.filter(todo => !todo.completed).length;

  function toggleAll() {
    const completedStatus = todoCount > 0;

    todos.forEach(todo => {
      if (todo.completed !== completedStatus) {
        toggleTodo(todo);
      }
    });
  }

  const value = {
    todos,
    tempTodo,
    getFilteredTodos,
    setError,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleAll,
    toggleTodo,
    clearCompleted,
    errorMessage,
    todoCount,
    statusResponse,
    title,
    setTitle,
    isUpdating,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
