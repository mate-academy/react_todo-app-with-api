import React, { useEffect, useMemo, useState } from 'react';
import { Context } from './types/Context';
import { Todo } from './types/Todo';
import * as todosService from './api/todos';
import { Errors } from './types/Errors';
import { FILTER } from './types/FILTER';

const USER_ID = 11711;

const initalStates: Context = {
  todos: [],
  visibleTodos: [],
  isUpdating: [],
  title: '',
  errorMessage: '',
  activeTodos: 0,
  statusResponce: false,
  currentFilter: FILTER.ALL,
  tempTodo: null,
  addTodo: () => {},
  setTitle: () => {},
  setError: () => {},
  setCurrentFilter: () => {},
  handlerClearCompletedTodos: () => {},
  toggleTodo: () => {},
  deleteTodo: () => {},
  toggleAll: () => {},
  updateTodo: async () => {},
};

export const TodosContext = React.createContext(initalStates);

type Props = {
  children: React.ReactNode;
};

export const Todosrovider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [statusResponce, setStatusResponce] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(FILTER.ALL);
  const [isUpdating, setIsUpdating] = useState<number[]>([]);

  function setError(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(Errors.None);
    }, 3000);
  }

  useEffect(() => {
    todosService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Errors.Load));
  }, []);

  const visibleTodos = useMemo(() => {
    let preparedTodos = [...todos];

    preparedTodos = preparedTodos.filter((todo) => {
      switch (currentFilter) {
        case FILTER.ACTIVE:
          return !todo.completed;

        case FILTER.COMPLETED:
          return todo.completed;

        case FILTER.ALL:
        default:
          return true;
      }
    });

    return preparedTodos;
  }, [todos, currentFilter]);

  const addTodo = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(Errors.Title);

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

    todosService
      .createTodo(data)
      .then((newTodo) => {
        setTodos((currentTodo) => [...currentTodo, newTodo]);
        setTitle('');
      })
      .catch(() => setError(Errors.Add))
      .finally(() => {
        setTempTodo(null);
        setStatusResponce(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setStatusResponce(true);
    setIsUpdating(current => [...current, todoId]);

    todosService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
        setStatusResponce(false);
      })
      .catch(() => setError(Errors.Delete))
      .finally(() => {
        setIsUpdating(current => current
          .filter(id => id !== todoId));
      });
  };

  const updateTodo = (newTodo: Todo) => {
    setIsUpdating(current => [...current, newTodo.id]);
    setStatusResponce(true);

    return todosService.updateTodo(newTodo)
      .then(() => {
        setTodos(current => current
          .map(curTodo => (curTodo.id === newTodo.id ? newTodo : curTodo)));
      })
      .catch((error) => {
        setError(Errors.Update);
        throw error;
      })
      .finally(() => {
        setIsUpdating(current => current.filter(id => id !== newTodo.id));
        setStatusResponce(false);
      });
  };

  const toggleTodo = (todo: Todo) => {
    const { completed } = todo;

    const newTodo = {
      ...todo,
      completed: !completed,
    };

    updateTodo(newTodo)
      .then(() => {})
      .catch(() => {});
  };

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  const toggleAll = () => {
    const completedStatus = activeTodos > 0;

    todos.forEach(todo => {
      if (todo.completed !== completedStatus) {
        toggleTodo(todo);
      }
    });
  };

  const handlerClearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => Promise.resolve(deleteTodo(todo.id)));

    Promise.allSettled(completedTodos);
  };

  const state = {
    todos,
    visibleTodos,
    isUpdating,
    title,
    errorMessage,
    activeTodos,
    statusResponce,
    currentFilter,
    tempTodo,
    addTodo,
    setTitle,
    setError,
    setCurrentFilter,
    handlerClearCompletedTodos,
    toggleTodo,
    deleteTodo,
    toggleAll,
    updateTodo,
  };

  return (
    <TodosContext.Provider value={state}>{children}</TodosContext.Provider>
  );
};
