import React, { useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import * as todosServices from './api/todos';
import { TodosContextType } from './types/TodosContextTypes';

export const USER_ID = 11730;

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  filtredTodos: [],
  isLoadingTodo: [],
  errorMessage: '',
  setErrorMessage: () => {},
  statusFilter: Filter.ALL,
  setStatusFilter: () => {},
  IsStatusResponse: false,
  setIsStatusResponse: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  changeErrorMessage: () => {},
  addTodo: () => {},
  deleteTodo: () => {},
  updateTodo: async () => {},
  activeTodos: 0,
  hasSomeCompletedTodos: false,
  handlerClearCompleted: () => {},
  toggleTodo: () => {},
  handlerToggleAll: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingTodo, setIsLoadingTodo] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState(Filter.ALL);
  const [IsStatusResponse, setIsStatusResponse] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function changeErrorMessage(message: string) {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  React.useEffect(() => {
    todosServices
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        changeErrorMessage('Unable to load todos');
      });
  }, []);

  const filtredTodos: Todo[] = React.useMemo(() => {
    let filtered = todos;

    switch (statusFilter) {
      case Filter.ACTIVE:
        filtered = filtered.filter(todo => !todo.completed);
        break;

      case Filter.COMPLETED:
        filtered = filtered.filter(todo => todo.completed);
        break;

      default:
        break;
    }

    return filtered;
  }, [todos, statusFilter]);

  const addTodo = (title: string, setTitle: (title: string) => void) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      changeErrorMessage('Title should not be empty');

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

    setIsStatusResponse(true);

    todosServices
      .createTodo(data)
      .then((newTodo) => {
        setTitle('');
        setTodos((currentTodos) => [...currentTodos, newTodo]);
      })
      .catch(() => {
        changeErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsStatusResponse(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsStatusResponse(true);
    setIsLoadingTodo((currentTodo) => [...currentTodo, todoId]);

    todosServices
      .removeTodo(todoId)
      .then(() => {
        setTodos(
          (currentTodo) => currentTodo.filter((todo) => todo.id !== todoId),
        );
        setIsStatusResponse(false);
      })
      .catch(() => changeErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsLoadingTodo(currentTodo => currentTodo.filter(
          (id: number) => id !== todoId,
        ));
        setIsStatusResponse(false);
      });
  };

  const updateTodo = (newTodo: Todo) => {
    setIsLoadingTodo(currentTodo => [...currentTodo, newTodo.id]);
    setIsStatusResponse(true);

    return todosServices.updateTodo(newTodo)
      .then(() => {
        setTodos(
          currentTodo => currentTodo.map(curTodo => (
            curTodo.id === newTodo.id ? newTodo : curTodo
          )),
        );
        setIsStatusResponse(false);
      })
      .catch((error) => {
        changeErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setIsLoadingTodo(currentTodo => currentTodo.filter(
          id => id !== newTodo.id,
        ));
        setIsStatusResponse(false);
      });
  };

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const hasSomeCompletedTodos = todos.some(todo => todo.completed);

  const handlerClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => Promise.resolve(deleteTodo(todo.id)));

    Promise.allSettled(completedTodos);
  };

  const toggleTodo = (todo: Todo) => {
    const { completed } = todo;

    const newTodo = {
      ...todo,
      completed: !completed,
    };

    updateTodo(newTodo);
  };

  const handlerToggleAll = () => {
    const completedStatus = activeTodos > 0;

    todos.forEach(todo => {
      if (todo.completed !== completedStatus) {
        toggleTodo(todo);
      }
    });
  };

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      filtredTodos,
      isLoadingTodo,
      errorMessage,
      setErrorMessage,
      statusFilter,
      setStatusFilter,
      IsStatusResponse,
      setIsStatusResponse,
      tempTodo,
      setTempTodo,
      changeErrorMessage,
      addTodo,
      deleteTodo,
      updateTodo,
      activeTodos,
      hasSomeCompletedTodos,
      handlerClearCompleted,
      toggleTodo,
      handlerToggleAll,
    }}
    >
      { children }
    </TodosContext.Provider>
  );
};
