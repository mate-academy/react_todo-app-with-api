import React, { useState, useMemo } from 'react';
import * as todoService from '../service/todo';
import { Error } from '../types/Error';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  children: React.ReactNode
};

interface Context {
  todos: Todo[],
  status: Status,
  errorMessage: Error,
  tempTodo: Todo | null,
  loadingIds: number[],
  isFieldDisabled: boolean,
  activeTodos: Todo[],
  handleTodoAdd: ({ title, userId, completed }: Omit<Todo, 'id'>) => void,
  toggleTodoStatus: (todo: Todo) => void,
  toggleAll: () => void,
  handleDeleteCompleted: () => void,
  handleStatus: (newStatus: Status) => void,
  handleUpdateTodo: (updatedTodo: Todo) => void,
  handleDeleteTodo: (deleteId: number) => void,
  handleErrorMessage: (error: Error) => void,
  handleDisabled: (disable: boolean) => void,
  setTodos: (response: Todo[]) => void,
}

export const TodosContext = React.createContext<Context>({
  todos: [],
  status: Status.All,
  errorMessage: Error.None,
  tempTodo: null,
  loadingIds: [],
  isFieldDisabled: false,
  activeTodos: [],
  handleTodoAdd: () => { },
  toggleTodoStatus: () => { },
  handleDeleteCompleted: () => { },
  handleStatus: () => { },
  toggleAll: () => { },
  handleUpdateTodo: () => { },
  handleDeleteTodo: () => { },
  handleErrorMessage: () => { },
  handleDisabled: () => { },
  setTodos: () => { },
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [isFieldDisabled, setIsFieldDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const activeTodos = todos.filter(todo => !todo.completed);

  const handleDisabled = (disable: boolean) => {
    setIsFieldDisabled(disable);
  };

  const handleErrorMessage = (error: Error) => {
    setErrorMessage(error);
  };

  const handleDeleteCompleted = async () => {
    const allCompleted = todos.filter(todo => todo.completed);
    const completedIds = allCompleted.map(todo => todo.id);

    setLoadingIds(state => [
      ...state,
      ...completedIds,
    ]);

    try {
      handleDisabled(true);
      await Promise.all(completedIds.map(id => {
        return todoService.deleteTodos(`/todos/${id}`);
      }));
      setTodos(prev => prev.filter(todo => !completedIds.includes(todo.id)));
    } catch {
      setErrorMessage(Error.Delete);
    } finally {
      setLoadingIds([]);
      handleDisabled(false);
    }
  };

  const toggleTodoStatus = (updatedTodo: Todo) => {
    setLoadingIds(state => [
      ...state,
      updatedTodo.id,
    ]);

    return todoService.updateTodos(updatedTodo)
      .then(newTodo => {
        setTodos(state => state.map(todo => (todo.id === newTodo.id
          ? newTodo
          : todo)));
      })

      .catch(() => {
        setErrorMessage(Error.Update);
      })
      .finally(() => {
        setIsFieldDisabled(false);
        setLoadingIds([]);
      });
  };

  const toggleAll = async () => {
    const todosToUpdate = activeTodos.length ? activeTodos : todos;
    const activeTodosIds = todosToUpdate.map(todo => todo.id);

    setLoadingIds(state => [
      ...state,
      ...activeTodosIds,
    ]);

    try {
      await Promise.all(todosToUpdate.map(updatedTodo => {
        return todoService.updateTodos({
          ...updatedTodo, completed: !updatedTodo.completed,
        });
      }));
      setTodos(state => state.map(todo => (activeTodosIds.includes(todo.id)
        ? { ...todo, completed: !todo.completed }
        : todo)));
    } catch {
      setErrorMessage(Error.Update);
    } finally {
      setLoadingIds([]);
    }
  };

  const handleTodoAdd = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    setTempTodo({
      id: 0,
      userId,
      title,
      completed,
    });

    return todoService.createTodos({ title, userId, completed })
      .then(newTodo => {
        setTodos(
          [
            ...todos,
            newTodo,
          ],
        );

        setErrorMessage(Error.None);
      })
      .catch(() => {
        setErrorMessage(Error.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsFieldDisabled(false);
      });
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setLoadingIds(state => [
      ...state,
      updatedTodo.id,
    ]);

    setTodos(state => state.map(todo => (todo.id === updatedTodo.id
      ? { ...todo, title: updatedTodo.title }
      : todo)));

    return todoService.updateTodos(updatedTodo)
      .then(newTodo => {
        setTodos(state => state.map(todo => (todo.id === newTodo.id
          ? newTodo
          : todo)));
      })

      .catch(() => {
        setErrorMessage(Error.Update);
      })
      .finally(() => {
        setIsFieldDisabled(false);
        setLoadingIds([]);
      });
  };

  const handleDeleteTodo = (deleteId: number) => {
    handleDisabled(true);

    setLoadingIds(state => [
      ...state,
      deleteId,
    ]);

    return todoService.deleteTodos(`/todos/${deleteId}`)
      .then(() => {
        setTodos(state => state.filter(todo => todo.id !== deleteId));
      })
      .catch(() => {
        setErrorMessage(Error.Delete);
      })
      .finally(() => {
        setLoadingIds([]);
        handleDisabled(false);
      });
  };

  const handleStatus = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const value = useMemo(() => ({
    todos,
    status,
    errorMessage,
    tempTodo,
    loadingIds,
    isFieldDisabled,
    activeTodos,
    handleTodoAdd,
    toggleTodoStatus,
    handleDeleteCompleted,
    handleStatus,
    toggleAll,
    handleUpdateTodo,
    handleDeleteTodo,
    handleErrorMessage,
    handleDisabled,
    setTodos,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [todos, status, errorMessage, tempTodo, loadingIds, isFieldDisabled]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
