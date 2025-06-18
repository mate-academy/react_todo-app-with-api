import { useEffect, useMemo, useState } from 'react';
import {
  USER_ID,
  getTodos,
  deleteTodo,
  postTodo,
  patchTodo,
} from '../api/todos';
import { ErrorMessages, Todo } from '../types/types';

export const useTodoActions = () => {
  const [todoData, setTodoData] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoInOperation, setTodoInOperation] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );

  useEffect(() => {
    getTodos()
      .then(setTodoData)
      .catch(() => setErrorMessage(ErrorMessages.OnGet));
  }, []);

  const { activeTodos, isCompletedTodos, isAllTodoCompleted, hasTodo } =
    useMemo(
      () => ({
        activeTodos: todoData.filter(todo => !todo.completed).length,
        isCompletedTodos: todoData.some(todo => todo.completed),
        isAllTodoCompleted:
          todoData.length > 0 && todoData.every(todo => todo.completed),
        hasTodo: !!todoData.length,
      }),
      [todoData],
    );

  const isLoading = useMemo(() => !!todoInOperation.length, [todoInOperation]);

  const addTodo = async (title: string) => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage(ErrorMessages.OnEmptyTitle);

      return Promise.resolve(false);
    }

    const newTodo = {
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });
    setTodoInOperation(cur => [...cur, 0]);

    try {
      const todoFromServer = await postTodo(newTodo);

      setTodoData(current => [...current, todoFromServer]);

      return true;
    } catch {
      setErrorMessage(ErrorMessages.OnPost);

      return false;
    } finally {
      setTodoInOperation(cur => cur.filter(id => id !== 0));
      setTempTodo(null);
    }
  };

  const deleteTodoById = async (id: number) => {
    setTodoInOperation(cur => [...cur, id]);

    try {
      await deleteTodo(id);
      setTodoData(cur => cur.filter(todo => todo.id !== id));

      return true;
    } catch {
      setErrorMessage(ErrorMessages.OnDelete);

      return false;
    } finally {
      setTodoInOperation(cur => cur.filter(curId => curId !== id));
    }
  };

  const handleUpdate = async (normalizedTitle: string, id: number) => {
    setTodoInOperation(cur => [...cur, id]);

    try {
      const updatedTodo = await patchTodo(id, { title: normalizedTitle });

      setTodoData(cur =>
        cur.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );

      return true;
    } catch {
      setErrorMessage(ErrorMessages.OnPatch);

      return false;
    } finally {
      setTodoInOperation(cur => cur.filter(curId => curId !== id));
    }
  };

  const toggleTodo = async (currentId: number, completed: boolean) => {
    setTodoInOperation(cur => [...cur, currentId]);

    try {
      const updatedTodo = await patchTodo(currentId, { completed });

      setTodoData(cur =>
        cur.map(todo =>
          todo.id === currentId
            ? { ...todo, completed: updatedTodo.completed }
            : todo,
        ),
      );

      return true;
    } catch {
      setErrorMessage(ErrorMessages.OnPatch);

      return false;
    } finally {
      setTodoInOperation(cur => cur.filter(curId => curId !== currentId));
    }
  };

  const deleteCompleted = async () => {
    const completedIds = todoData
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setTodoInOperation(cur => [...cur, ...completedIds]);

    const results = await Promise.allSettled(
      completedIds.map(id => deleteTodo(id)),
    );

    const hasError = results.some(result => result.status === 'rejected');
    const successIds = completedIds.filter(
      (_, idx) => results[idx].status === 'fulfilled',
    );

    if (hasError) {
      setErrorMessage(ErrorMessages.OnDelete);
    }

    setTodoInOperation(cur => cur.filter(id => !completedIds.includes(id)));
    setTodoData(cur => cur.filter(todo => !successIds.includes(todo.id)));
  };

  const toggleAll = async () => {
    const newStatus = !isAllTodoCompleted;

    const idsToUpdate = todoData
      .filter(todo => todo.completed !== newStatus)
      .map(todo => todo.id);

    setTodoInOperation(cur => [...cur, ...idsToUpdate]);

    const results = await Promise.allSettled(
      idsToUpdate.map(id => patchTodo(id, { completed: newStatus })),
    );

    const hasError = results.some(result => result.status === 'rejected');
    const successIds = results
      .filter(result => result.status === 'fulfilled')
      .map(item => item.value.id);

    if (hasError) {
      setErrorMessage(ErrorMessages.OnPatch);
    }

    setTodoInOperation(cur => cur.filter(id => !idsToUpdate.includes(id)));
    setTodoData(cur =>
      cur.map(todo =>
        successIds.includes(todo.id) ? { ...todo, completed: newStatus } : todo,
      ),
    );
  };

  return {
    isAllTodoCompleted,
    isCompletedTodos,
    todoInOperation,
    errorMessage,
    activeTodos,
    isLoading,
    tempTodo,
    todoData,
    hasTodo,
    setErrorMessage,
    deleteCompleted,
    handleUpdate,
    deleteTodo: deleteTodoById,
    toggleTodo,
    toggleAll,
    addTodo,
  };
};
