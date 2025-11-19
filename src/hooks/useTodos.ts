import { useCallback, useState } from 'react';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { TodoError } from '../types/TodoError';

interface ReturnType {
  todos: Todo[];
  isCreating: boolean;
  error: string;
  tempItem: Todo | null;
  modifyIds: number[];
  isOperationEnd: boolean;
  setError: (err: string) => void;
  addTodo: (title: string) => Promise<void>;
  removeTodo: (todoId: number) => Promise<void>;
  clearCompletedTodos: () => Promise<void>;
  updateTodoStatus: (todo: Todo) => Promise<void>;
  updateTodosStatus: () => Promise<void>;
  getTodos: () => void;
  updatingTodoId: number | null;
  changeTitle: (todo: Todo) => Promise<void>;
  changeUpdatingId: (todoId: number | null) => void;
}

export const useTodos = (): ReturnType => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [tempItem, setTempItem] = useState<Todo | null>(null);
  const [modifyIds, setModifyIds] = useState<number[]>([]);
  const [isOperationEnd, setIsOperationEnd] = useState(true);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);

  const clearError = () => {
    setError('');
  };

  const getTodos = useCallback(async () => {
    clearError();

    try {
      const fetchedTodos = await todoService.getTodos();

      setTodos(fetchedTodos);
    } catch (e) {
      setError(TodoError.LOADING);
    }
  }, []);

  const addTodo = useCallback(async (title: string) => {
    clearError();
    setIsCreating(true);
    setTempItem({
      id: 0,
      title,
      completed: false,
      userId: todoService.USER_ID,
    });

    try {
      const newTodo = await todoService.addTodo({ title, completed: false });

      setTodos(curTodos => [...curTodos, newTodo]);
    } catch (e) {
      setError(TodoError.ADDING);

      throw e;
    } finally {
      setTempItem(null);
      setIsCreating(false);
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    clearError();
    setModifyIds(currentIds => [...currentIds, todoId]);
    setIsOperationEnd(false);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(curTodos => curTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setError(TodoError.DELETING);
    } finally {
      setModifyIds(currentIds => currentIds.filter(item => item !== todoId));
      setIsOperationEnd(true);
    }
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    clearError();
    setIsOperationEnd(false);
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedTodosIds.length === 0) {
      return;
    }

    setModifyIds(curIds => [...curIds, ...completedTodosIds]);

    try {
      const result = await Promise.allSettled(
        completedTodosIds.map(todoId => todoService.deleteTodo(todoId)),
      );

      const success = completedTodosIds.filter(
        (_, index) => result[index].status === 'fulfilled',
      );
      const withError = completedTodosIds.filter(
        (_, index) => result[index].status === 'rejected',
      );

      setTodos(curTodos => curTodos.filter(todo => !success.includes(todo.id)));

      if (withError.length !== 0) {
        throw new Error(TodoError.DELETING);
      }
    } catch (e) {
      setError(TodoError.DELETING);
    } finally {
      setModifyIds(curIds =>
        curIds.filter(id => !completedTodosIds.includes(id)),
      );
      setIsOperationEnd(true);
    }
  }, [todos]);

  const updateTodoStatus = useCallback(async (todo: Todo) => {
    const { id, completed } = todo;

    clearError();
    setModifyIds(curIds => [...curIds, id]);
    setIsOperationEnd(false);

    try {
      const result = await todoService.updateTodo(id, {
        completed: !completed,
      });

      setTodos(curTodos => {
        const prevTodoIndex = curTodos.findIndex(curTodo => curTodo.id === id);

        if (prevTodoIndex !== -1) {
          const updatedTodos = [...curTodos];

          updatedTodos.splice(prevTodoIndex, 1, result);

          return updatedTodos;
        }

        return curTodos;
      });
    } catch (e) {
      setError(TodoError.UPDATING);
    } finally {
      setModifyIds(curIds => curIds.filter(todoId => todoId !== id));
      setIsOperationEnd(true);
    }
  }, []);

  const updateTodosStatus = useCallback(async () => {
    clearError();
    setIsOperationEnd(false);

    const uncompletedTodos = todos
      .filter(todo => !todo.completed)
      .map(todo => todo.id);

    const idsToUpdate =
      uncompletedTodos.length !== 0
        ? uncompletedTodos
        : todos.map(todo => todo.id);

    setModifyIds(curIds => [...curIds, ...idsToUpdate]);

    try {
      const result = await Promise.allSettled(
        idsToUpdate.map(todo =>
          todoService.updateTodo(todo, {
            completed:
              uncompletedTodos.length !== 0
                ? true
                : !todos.find(t => t.id === todo)?.completed,
          }),
        ),
      );

      const success = idsToUpdate.filter(
        (_, index) => result[index].status === 'fulfilled',
      );
      const withError = idsToUpdate.filter(
        (_, index) => result[index].status === 'rejected',
      );

      setTodos(curTodos => {
        const updatedTodos = curTodos.map(todo => {
          const foundedTodo = success.find(todoId => todo.id === todoId);

          if (foundedTodo) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        });

        return updatedTodos;
      });

      if (withError.length !== 0) {
        throw new Error(TodoError.UPDATING);
      }
    } catch (e) {
      setError(TodoError.UPDATING);
    } finally {
      setModifyIds(curIds =>
        curIds.filter(todoId => !idsToUpdate.includes(todoId)),
      );
      setIsOperationEnd(true);
    }
  }, [todos]);

  const changeTitle = useCallback(async (todo: Todo) => {
    clearError();
    setModifyIds(curIds => [...curIds, todo.id]);

    try {
      const result = await todoService.updateTodo(todo.id, {
        title: todo.title,
      });

      setTodos(curTodos =>
        curTodos.map(t => {
          if (t.id === result.id) {
            return { ...t, title: result.title };
          }

          return t;
        }),
      );
    } catch (e) {
      setError(TodoError.UPDATING);
      throw e;
    } finally {
      setModifyIds(curIds => curIds.filter(id => id !== todo.id));
    }
  }, []);

  const changeUpdatingId = useCallback((todoId: number | null) => {
    setUpdatingTodoId(todoId);
  }, []);

  return {
    todos,
    isCreating,
    error,
    modifyIds,
    isOperationEnd,
    setError,
    tempItem,
    addTodo,
    removeTodo,
    clearCompletedTodos,
    updateTodoStatus,
    updateTodosStatus,
    getTodos,
    updatingTodoId,
    changeTitle,
    changeUpdatingId,
  };
};
