import { useState } from 'react';
import { Todo } from '../types/Todo';
import { getTodos, deleteTodos, postTodos, patchTodos } from '../api/todos';
import { ErrorMessage } from '../types/Error';
import { USER_ID } from '../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const fetchAllTodos = async () => {
    try {
      const data = await getTodos();

      setTodos(data);
    } catch (error) {
      throw new Error(ErrorMessage.LOAD);
    }
  };

  const updateChecked = async (todo: Todo) => {
    setLoadingIds(prev => [...prev, todo.id]);

    try {
      const newStatus = !todo.completed;
      const updateTodo = await patchTodos(todo.id, { completed: newStatus });

      setTodos(prevTodos =>
        prevTodos.map(oldTodo =>
          oldTodo.id === updateTodo.id ? updateTodo : oldTodo,
        ),
      );
    } catch (error) {
      throw new Error(ErrorMessage.UPDATE);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const deleteTodo = async (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    try {
      await deleteTodos(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      throw new Error(ErrorMessage.DELETE);
    } finally {
      setLoadingIds(prev => prev.filter(x => x !== id));
    }
  };

  const postTodo = async (title: string) => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      throw new Error(ErrorMessage.EMPTY_TITLE);
    }

    setIsLoading(true);

    const temp: Todo = {
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);

    try {
      const newTask = await postTodos({
        title: normalizedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, newTask]);
    } catch (error) {
      throw new Error(ErrorMessage.ADD);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleToggleAll = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);
    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...idsToUpdate]);
    try {
      const updatePromises = todosToUpdate.map(todo =>
        patchTodos(todo.id, { completed: newStatus }),
      );

      const updatedTodos = await Promise.all(updatePromises);

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          const updated = updatedTodos.find(u => u.id === todo.id);

          return updated ? updated : todo;
        }),
      );
    } catch (error) {
      throw new Error(ErrorMessage.UPDATE);
    } finally {
      setLoadingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
    }
  };

  const clearCompleted = async () => {
    setIsClearing(true);
    const completedTodos = todos.filter(todo => todo.completed);
    const loadingIdsToClear = completedTodos.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...loadingIdsToClear]);
    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodos(todo.id)),
      );

      const hasErrors = results.some(result => result.status === 'rejected');

      const successfulIds = results
        .map((result, index) =>
          result.status === 'fulfilled' ? completedTodos[index].id : null,
        )
        .filter((id): id is number => id !== null);

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

      if (hasErrors) {
        throw new Error(ErrorMessage.DELETE);
      }
    } catch (error) {
      throw new Error(ErrorMessage.DELETE);
    } finally {
      setIsClearing(false);
      setLoadingIds(prev => prev.filter(id => !loadingIdsToClear.includes(id)));
    }
  };

  const updateTodoTitle = async (id: number, title: string) => {
    try {
      const updatedTodo = await patchTodos(id, { title });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
      );
    } catch (error) {
      throw new Error(ErrorMessage.UPDATE);
    }
  };

  return {
    todos,
    setTodos,
    isLoading,
    setIsLoading,
    loadingIds,
    setLoadingIds,
    tempTodo,
    setTempTodo,
    isClearing,
    setIsClearing,
    fetchAllTodos,
    updateChecked,
    deleteTodo,
    postTodo,
    clearCompleted,
    handleToggleAll,
    updateTodoTitle,
  };
};
