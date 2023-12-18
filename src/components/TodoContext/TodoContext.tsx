/* eslint-disable max-len */
import React, {
  createContext, useCallback, useMemo, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import * as todoService from '../../api/todos';
import { USER_ID } from '../../constants/UserId';
import { ErrorType } from '../../types/ErrorType';

interface AppContextType {
  todos: Todo[];
  status: Status;
  setTodos: (arg: Todo[]) => void;
  setStatus: (arg: Status) => void;
  deleteTodo: (arg: number) => void;
  selectedTodoIds: number[];
  setSelectedTodoIds: (arg: number[]) => void;
  handleToggleCompleted: (arg: Todo) => void;
  clearCompleted: () => void;
  todoTitle: string;
  setTodoTitle: (arg: string) => void;
  tempTodo: Todo | null;
  setTempTodo: (arg: Todo | null) => void;
  addTodo: (arg: string) => void;
  error: ErrorType | null;
  setError: (arg: ErrorType | null) => void;
  loading: boolean;
  setLoading: (arg: boolean) => void;
  updateTodoItem: (arg: Todo) => void;
}

export const AppContext = createContext<AppContextType>({
  todos: [],
  status: Status.All,
  setTodos: () => {},
  setStatus: () => {},
  deleteTodo: () => {},
  selectedTodoIds: [],
  setSelectedTodoIds: () => {},
  handleToggleCompleted: () => {},
  clearCompleted: () => {},
  todoTitle: '',
  setTodoTitle: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  addTodo: () => {},
  error: null,
  setError: () => {},
  loading: false,
  setLoading: () => {},
  updateTodoItem: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorType | null>(null);
  const [loading, setLoading] = useState(false);

  const deleteTodo = useCallback((todoId: number) => {
    setSelectedTodoIds((currentIds) => [...currentIds, todoId]);
    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTimeout(() => {
          setTodos((currentTodos) => currentTodos.filter((post) => post.id !== todoId));
        }, 500);
      })
      .catch(() => {
        setSelectedTodoIds((ids) => {
          ids.splice(ids.indexOf(todoId), 1);

          return ids;
        });
        setError(ErrorType.cantDeleteTodo);
        setTimeout(() => setError(null), 2000);
      })
      .finally(() => setTimeout(
        () => setSelectedTodoIds((ids) => ids.splice(ids.indexOf(todoId), 1)),
        500,
      ));
  }, []);

  const updateTodoItem = useCallback((updatedTodo: Todo) => {
    setLoading(true);
    setSelectedTodoIds((ids) => [...ids, updatedTodo.id]);

    todoService.updateTodo(updatedTodo)
      .then((todo) => {
        setTodos((currentTodos) => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            (newTodo) => newTodo.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(() => {
        setError(ErrorType.cantUpdateTodo);
        setTimeout(() => setError(null), 2000);
      })
      .finally(() => {
        setLoading(false);
        setSelectedTodoIds((ids) => ids.filter((id) => id !== updatedTodo.id));
      });
  }, []);

  const clearCompleted = useCallback(() => {
    const completedTodos = todos.filter((todoToFind) => todoToFind.completed);

    setSelectedTodoIds((currentIds) => [
      ...currentIds,
      ...completedTodos.map((completedTodo) => completedTodo.id),
    ]);

    completedTodos.map((completedTodo) => todoService.deleteTodo(completedTodo.id));

    setTimeout(() => {
      setTodos((currentTodos) => currentTodos.filter((todoToFilter) => !todoToFilter.completed));
    }, 500);
  }, [todos]);

  const handleToggleCompleted = useCallback((todoToChange: Todo) => {
    setSelectedTodoIds((currentIds) => [...currentIds, todoToChange.id]);
    const updatedTodo = {
      ...todoToChange,
      completed: !todoToChange.completed,
    };

    todoService
      .setCompleted(updatedTodo)
      .then((todo) => {
        setTodos((currentTodos) => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            (newTodo) => newTodo.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .finally(() => setTimeout(() => setSelectedTodoIds((ids) => {
        const newIds = [...ids];

        newIds.splice(ids.indexOf(todoToChange.id), 1);

        return newIds;
      })));
  }, []);

  const addTodo = (title: string) => {
    setLoading(true);
    setSelectedTodoIds((ids) => [...ids, 0]);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    todoService
      .createTodo({
        userId: USER_ID,
        title,
        completed: false,
      })
      .then((newTodo) => {
        setTodoTitle('');
        setTimeout(() => {
          setTodos((currentTodos) => [...currentTodos, newTodo]);
        }, 500);
      })
      .catch(() => {
        setSelectedTodoIds((ids) => ids.filter((id) => id !== 0));
        setError(ErrorType.cantAddTodo);
        setTimeout(() => setError(null), 2000);
      })
      .finally(() => {
        setLoading(false);
        setSelectedTodoIds((ids) => ids.filter((id) => id !== 0));
        setTimeout(() => setTempTodo(null), 500);
      });
  };

  const value = useMemo(
    () => ({
      todos,
      status,
      setTodos,
      setStatus,
      deleteTodo,
      selectedTodoIds,
      setSelectedTodoIds,
      handleToggleCompleted,
      clearCompleted,
      todoTitle,
      setTodoTitle,
      tempTodo,
      setTempTodo,
      addTodo,
      error,
      setError,
      loading,
      setLoading,
      updateTodoItem,
    }),
    [
      todos,
      status,
      selectedTodoIds,
      deleteTodo,
      handleToggleCompleted,
      clearCompleted,
      todoTitle,
      tempTodo,
      error,
      loading,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
