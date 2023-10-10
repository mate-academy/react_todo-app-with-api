import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Context } from './types/Context';
import * as todosServices from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 11644;

export const TodosContext = React.createContext<Context>({
  todos: [],
  tempTodo: null,
  getFilteredTodos: () => [],
  addTodo: () => {},
  deleteTodo: () => {},
  setError: () => { },
  setTitle: () => { },
  toggleTodo: () => { },
  updateTodo: async () => {},
  toggleAll: () => { },
  clearCompleted: () => { },
  title: '',
  errorMessage: ErrorMessage.none,
  statusResponce: false,
  isUpdating: [],
  todoCount: 0,
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.none);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [statusResponce, setStatusResponce] = useState(false);
  const [isUpdating, setIsUpdating] = useState<number[]>([]);

  function setError(message: ErrorMessage) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(ErrorMessage.none);
    }, 3000);
  }

  useEffect(() => {
    todosServices.getTodos(USER_ID)
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

    setStatusResponce(true);

    todosServices.createTodo(data)
      .then(newTodo => {
        setTodos(currentTodos => [
          ...currentTodos,
          newTodo,
        ]);

        setTitle('');
      })
      .catch(() => {
        setError(ErrorMessage.add);
      })
      .finally(() => {
        setTempTodo(null);
        setStatusResponce(false);
      });
  }

  function deleteTodo(todoId: number) {
    setStatusResponce(true);
    setIsUpdating(current => [
      ...current,
      todoId,
    ]);

    todosServices.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
        setStatusResponce(false);
      })
      .catch(() => {
        setError(ErrorMessage.delete);
      })
      .finally(() => {
        setIsUpdating(current => current
          .filter(id => id !== todoId));
      });
  }

  const updateTodo = (newTodo: Todo) => {
    setIsUpdating(current => [
      ...current,
      newTodo.id,
    ]);

    return todosServices
      .updateTodos(newTodo)
      .then(() => {
        setTodos((current) => current
          .map((curTodo) => (curTodo.id === newTodo.id
            ? newTodo
            : curTodo)));
      })
      .catch((error) => {
        setError(ErrorMessage.update);

        throw error;
      })
      .finally(() => {
        setIsUpdating(current => current.filter(id => id !== newTodo.id));
      });
  };

  function toggleTodo(todo: Todo) {
    const { completed } = todo;

    const newTodo = {
      ...todo,
      completed: !completed,
    };

    updateTodo(newTodo)
      .then(() => { })
      .catch(() => { });
  }

  const todoCount = todos
    .filter((todo: Todo) => !todo.completed).length;

  function toggleAll() {
    const completedStatus = todoCount > 0;

    todos.forEach(todo => {
      if (todo.completed !== completedStatus) {
        toggleTodo(todo);
      }
    });
  }

  function clearCompleted() {
    const completedTodos = todos
      .filter(todo => todo.completed);

    completedTodos.forEach(todo => Promise.resolve(deleteTodo(todo.id)));

    Promise.allSettled(completedTodos);
  }

  const value = {
    todos,
    tempTodo,
    getFilteredTodos,
    addTodo,
    deleteTodo,
    setError,
    toggleTodo,
    toggleAll,
    clearCompleted,
    errorMessage,
    title,
    setTitle,
    statusResponce,
    updateTodo,
    isUpdating,
    todoCount,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
