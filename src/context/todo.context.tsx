import React, {
  PropsWithChildren, useCallback, useEffect, useMemo, useState,
} from 'react';
import { Todo, TodoListFilterStatus } from '../types/Todo';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from '../api/todos';
import {
  getFilteredTodos, getTodosStatistics, ITodosStatistics,
} from '../services/todo.service';
import { ErrorValues } from '../types/Error';

const USER_ID = 11215;

interface ITodoContext {
  todos: Todo[],
  handleTodoListFilterStatus: (status: TodoListFilterStatus) => void,
  todoListFilterStatus: TodoListFilterStatus,
  todosStatistics: ITodosStatistics,
  error: ErrorValues | null,
  setError: React.Dispatch<React.SetStateAction<ErrorValues | null>>,
  addNewTodo: (title: string) => void,
  loadingTodo: Todo | null,
  removeTodo: (todoId: number) => void,
  selectedTodoIds: number[],
  removeCompletedTodos: () => void,
  onUpdateTodo: (todo: Todo) => void,
  toggleAllTodosStatus: () => void,
}

export const TodoContext
  = React.createContext<ITodoContext>({} as ITodoContext);

export const TodoProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todoListFilterStatus, setTodoListFilerStatus]
    = useState<TodoListFilterStatus>(TodoListFilterStatus.All);
  const [error, setError] = useState<ErrorValues | null>(null);
  const [loadingTodo, setLoadingTodo] = useState<Todo | null>(null);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => setError(ErrorValues.RequestError));
  }, []);

  const todos = useMemo(() => {
    return getFilteredTodos(
      todosFromServer, { filterStatus: todoListFilterStatus },
    );
  }, [todosFromServer, todoListFilterStatus]);

  const handleTodoListFilterStatus = (status: TodoListFilterStatus) => {
    setTodoListFilerStatus(status);
  };

  const todosStatistics = useMemo(() => {
    return getTodosStatistics(todosFromServer);
  }, [todosFromServer, todos]);

  const addNewTodo = useCallback((title: string) => {
    const newTodo: Omit<Todo, 'id'> = {
      title,
      completed: false,
      userId: USER_ID,
    };

    if (!title) {
      setError(ErrorValues.EmptyTitleError);

      return;
    }

    setLoadingTodo({ ...newTodo, id: 0 });

    createTodo(USER_ID, newTodo)
      .then(createdTodo => {
        setTodosFromServer(
          currentTodos => [...currentTodos, createdTodo],
        );

        return createdTodo;
      })
      .catch(() => {
        setError(ErrorValues.CantCreateTodoError);
      })
      .finally(() => setLoadingTodo(null));
  }, []);

  const removeTodo = useCallback((todoId: number) => {
    setSelectedTodoIds([todoId]);

    deleteTodo(todoId)
      .then(() => setTodosFromServer(
        currentTodos => currentTodos.filter(
          todo => todo.id !== todoId,
        ),
      ))
      .finally(() => setSelectedTodoIds([]));
  }, []);

  const removeCompletedTodos = () => {
    const completedTodosIds = todosFromServer
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setSelectedTodoIds(completedTodosIds);

    const needToRemovedTodos = completedTodosIds
      .map(id => deleteTodo(id));

    Promise.all(needToRemovedTodos)
      .then(() => setTodosFromServer(
        currentTodos => currentTodos.filter(
          todo => !todo.completed,
        ),
      ))
      .finally(() => setSelectedTodoIds([]));
  };

  const onUpdateTodo = (todo: Todo) => {
    setSelectedTodoIds(currentTodoIds => ([...currentTodoIds, todo.id]));

    updateTodo(todo.id, todo)
      .then(updatedTodo => setTodosFromServer(
        currentTodos => currentTodos.map(
          prevTodo => {
            return prevTodo.id === todo.id ? { ...updatedTodo } : prevTodo;
          },
        ),
      ))
      .catch(() => setError(ErrorValues.CantUpdateTodoError))
      .finally(() => {
        setSelectedTodoIds(currentTodoIds => currentTodoIds.filter(
          id => id !== todo.id,
        ));
      });
  };

  const toggleAllTodosStatus = () => {
    const isAllCompleted = todosFromServer.every(
      (todo, _index, array) => {
        return array.length > 0 && todo.completed;
      },
    );

    setSelectedTodoIds(todosFromServer
      .filter(todo => todo.completed === isAllCompleted)
      .map(todo => todo.id));

    const needToUpdateTodos = todosFromServer.map(
      todo => updateTodo(todo.id, { ...todo, completed: !isAllCompleted }),
    );

    Promise.all(needToUpdateTodos)
      .then(() => setTodosFromServer(
        currentTodos => currentTodos.map(
          todo => ({ ...todo, completed: !isAllCompleted }),
        ),
      ))
      .finally(() => setSelectedTodoIds([]));
  };

  return (
    <TodoContext.Provider value={{
      todos,
      handleTodoListFilterStatus,
      todoListFilterStatus,
      todosStatistics,
      error,
      setError,
      addNewTodo,
      loadingTodo,
      removeTodo,
      selectedTodoIds,
      removeCompletedTodos,
      onUpdateTodo,
      toggleAllTodosStatus,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};
