import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types/todo';
import { getTodos, postTodos, deleteTodo, updateTodo } from '../api/todos';
import { ErrorMessages } from '../types/enums';
import { USER_ID } from '../constant/const';

export const useTodos = (
  handleSetErrorMessage: (message: string) => void,
  inputRef: React.RefObject<HTMLInputElement>,
) => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosFromServer = await getTodos();

        setTodoList(todosFromServer);
      } catch (err) {
        handleSetErrorMessage(ErrorMessages.LOAD_FAILED);
      }
    };

    loadTodos();
  }, [handleSetErrorMessage]);

  const addTodo = useCallback(
    async (newTodoData: { title: string }): Promise<Todo | null> => {
      const tempTodo = {
        id: 0,
        userId: USER_ID,
        completed: false,
        ...newTodoData,
      };

      setProcessingIds(currIds => [...currIds, 0]);

      try {
        const savedTodo = await postTodos(tempTodo);

        setTodoList(currentTodos => [...currentTodos, savedTodo]);

        return savedTodo;
      } catch (err) {
        handleSetErrorMessage(ErrorMessages.ADD_FAILED);

        return null;
      } finally {
        setProcessingIds(currIds => currIds.filter(id => id !== 0));
      }
    },
    [handleSetErrorMessage],
  );

  const removeTodo = useCallback(
    async (todoId: number): Promise<boolean> => {
      setProcessingIds(currentIds => [...currentIds, todoId]);
      try {
        await deleteTodo(todoId);
        setTodoList(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        return true;
      } catch (err) {
        handleSetErrorMessage(ErrorMessages.DELETE_FAILED);

        return false;
      } finally {
        setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [handleSetErrorMessage, inputRef],
  );

  const updateTodoOnServer = useCallback(
    async (todoId: number, data: Partial<Todo>): Promise<boolean> => {
      setProcessingIds(currentIds => [...currentIds, todoId]);
      try {
        const updatedTodo = await updateTodo(todoId, data);

        setTodoList(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );

        return true;
      } catch (error) {
        handleSetErrorMessage(ErrorMessages.UPDATE_FAILED);

        return false;
      } finally {
        setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));
      }
    },
    [handleSetErrorMessage],
  );

  const handleToggleAll = useCallback(
    async (isAllCompleted: boolean, todosToUpdate: Todo[]) => {
      const targetCompleted = !isAllCompleted;
      const idsToUpdate = todosToUpdate.map(todo => todo.id);

      setProcessingIds(currIds => [...currIds, ...idsToUpdate]);
      try {
        await Promise.all(
          todosToUpdate.map(todo =>
            updateTodo(todo.id, { completed: targetCompleted }),
          ),
        );
        setTodoList(currTodos =>
          currTodos.map(todo => ({
            ...todo,
            completed: targetCompleted,
          })),
        );
      } catch {
        handleSetErrorMessage(ErrorMessages.UPDATE_FAILED);
      } finally {
        setProcessingIds(currIds =>
          currIds.filter(id => !idsToUpdate.includes(id)),
        );
      }
    },
    [handleSetErrorMessage],
  );

  const handleClearCompleted = useCallback(
    async (completedTodos: Todo[]) => {
      const idsToDelete = completedTodos.map(todo => todo.id);

      setProcessingIds(currentIds => [...currentIds, ...idsToDelete]);
      try {
        const results = await Promise.allSettled(
          completedTodos.map(todo => deleteTodo(todo.id)),
        );
        const successfullyDeletedIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        if (results.some(result => result.status === 'rejected')) {
          handleSetErrorMessage(ErrorMessages.DELETE_FAILED);
        }

        if (successfullyDeletedIds.length > 0) {
          setTodoList(currentTodos =>
            currentTodos.filter(
              todo => !successfullyDeletedIds.includes(todo.id),
            ),
          );
        }
      } catch (err) {
        handleSetErrorMessage(ErrorMessages.DELETE_FAILED);
      } finally {
        setProcessingIds(currentIds =>
          currentIds.filter(id => !idsToDelete.includes(id)),
        );
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [handleSetErrorMessage, inputRef],
  );

  return {
    todoList,
    processingIds,
    addTodo,
    removeTodo,
    updateTodo: updateTodoOnServer,
    handleToggleAll,
    handleClearCompleted,
  };
};
