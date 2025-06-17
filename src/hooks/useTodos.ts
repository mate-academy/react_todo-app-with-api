import { useCallback, useEffect, useState } from 'react';
import { deleteTodo, getTodos, postTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { StatusTodos } from '../types/StatusTodos';
import { ErrorNotificationMessage } from '../types/ErrorNotificationMessage';

const prepereTodos = (todos: Todo[], statusTodos: StatusTodos) => {
  switch (statusTodos) {
    case StatusTodos.Completed:
      return todos.filter(todo => todo.completed);
    case StatusTodos.Active:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};

export const useTodos = () => {
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [isUpdatingTodo, setIsUpdatingTodo] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletedTodoId, setDeletedTodoId] = useState<Todo['id']>(0);
  const [toggledTodoId, setToggledTodoId] = useState<Todo['id']>(0);

  const [errorMessage, setErrorMessage] = useState(
    ErrorNotificationMessage.Cleared,
  );

  const [newTitle, setNewTitle] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');

  const [selectStatusTodos, setSelectStatusTodos] = useState(StatusTodos.All);

  const visibleTodos = prepereTodos(todos, selectStatusTodos);

  const isActive = todos.every(todo => todo.completed);

  useEffect(() => {
    setIsLoadingTodos(true);
    setErrorMessage(ErrorNotificationMessage.Cleared);

    getTodos()
      .then(setTodos)
      .catch(error => {
        if (error instanceof Error) {
          setErrorMessage(ErrorNotificationMessage.UnableToLoadTodos);
          throw new Error(error.message);
        }
      })
      .finally(() => setIsLoadingTodos(false));
  }, []);

  const handleAddTodo = useCallback(
    async ({ title, completed, userId }: Omit<Todo, 'id'>) => {
      const temp = { id: 0, title, completed, userId };

      setTempTodo(temp);

      try {
        const newTodo = await postTodo({ title, completed, userId });

        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTitle('');
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(ErrorNotificationMessage.UnableToAddTodos);
          throw new Error(error.message);
        }
      } finally {
        setTempTodo(null);
      }
    },
    [],
  );

  const handleChangeTodo = useCallback(
    async ({ id, title, completed }: Omit<Todo, 'userId'>) => {
      try {
        await updateTodo({ id, title, completed });

        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === id ? { ...todo, title, completed } : todo,
          ),
        );
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(ErrorNotificationMessage.UnableToUpdateTodos);
          throw new Error(error.message);
        }
      } finally {
        setToggledTodoId(0);
      }
    },
    [],
  );

  const handleChangeAllTodos = useCallback(async () => {
    const shouldBeCompleted = !isActive;

    setIsUpdatingTodo(true);

    try {
      const updatePromises = todos
        .filter(todo => todo.completed !== shouldBeCompleted)
        .map(todo =>
          updateTodo({
            id: todo.id,
            title: todo.title,
            completed: shouldBeCompleted,
          }),
        );

      await Promise.all(updatePromises);

      setTodos(currentTodos =>
        currentTodos.map(todo => ({
          ...todo,
          completed: shouldBeCompleted,
        })),
      );
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(ErrorNotificationMessage.UnableToUpdateTodos);
      }
    } finally {
      setIsUpdatingTodo(false);
    }
  }, [isActive, todos]);

  const handleDeleteTodo = useCallback(async (todoId: Todo['id']) => {
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(ErrorNotificationMessage.UnableToDeleteTodos);
        throw new Error(error.message);
      }
    } finally {
      setTempTodo(null);
      setDeletedTodoId(0);
    }
  }, []);

  const handleDeleteCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currTodo => currTodo.id !== todo.id),
          );
        })
        .catch(error => {
          if (error instanceof Error) {
            setErrorMessage(ErrorNotificationMessage.UnableToDeleteTodos);
            throw new Error(error.message);
          }
        }),
    );
  }, [todos]);

  return {
    isLoadingTodos,
    isUpdatingTodo,
    todos,
    tempTodo,
    deletedTodoId,
    toggledTodoId,
    errorMessage,
    newTitle,
    updateTitle,
    selectStatusTodos,
    visibleTodos,
    isActive,

    setNewTitle,
    setUpdateTitle,
    setSelectStatusTodos,
    setDeletedTodoId,
    setToggledTodoId,
    setErrorMessage,

    handleAddTodo,
    handleChangeTodo,
    handleChangeAllTodos,
    handleDeleteTodo,
    handleDeleteCompleted,
  };
};
