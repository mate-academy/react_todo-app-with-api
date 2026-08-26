import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoRename,
  updateTodoToggle,
} from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');

  const [deletingTodoId, setDeletingTodoId] = useState<number[]>([]);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [blockedInput, setBlockedInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const timerError = useRef<NodeJS.Timeout | null>(null);

  const todosCounter = todos.reduce((curr, todo) => {
    return !todo.completed ? curr + 1 : curr;
  }, 0);

  const hasCompletedTodos = todos.some(todo => todo.completed);

  function completedAllTodos() {
    const allCompletedCurrent =
      todos.length > 0 && todos.every(todo => todo.completed);

    const newStatusTodoCompleted = todos.filter(
      todoStatus => todoStatus.completed === allCompletedCurrent,
    );

    setLoadingTodo(newStatusTodoCompleted.map(item => item.id));

    newStatusTodoCompleted.forEach(todoItem => {
      updateTodoToggle(todoItem.id, !allCompletedCurrent)
        .then(data => {
          setTodos(currentTodos =>
            currentTodos.map(currentTodo => {
              if (currentTodo.id === data.id) {
                return data;
              }

              return currentTodo;
            }),
          );

          setLoadingTodo(currentTodosId =>
            currentTodosId.filter(id => id !== todoItem.id),
          );
        })
        .catch(() => {
          setError(ErrorMessage.Update);

          setLoadingTodo(currentTodosId =>
            currentTodosId.filter(id => id !== todoItem.id),
          );
        });
    });
  }

  function handleAddTodo(newTitle: string) {
    setBlockedInput(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: false,
    });

    return addTodo({
      userId: USER_ID,
      title: newTitle,
      completed: false,
    })
      .then(data => {
        setBlockedInput(false);
        setTempTodo(null);

        setTodos(currentTodos => [...currentTodos, data]);

        return true;
      })
      .catch(() => {
        setBlockedInput(false);
        setTempTodo(null);

        setError(ErrorMessage.Add);

        return false;
      });
  }

  function saveEdit(id: number, newTitle: string) {
    setError('');

    setLoadingTodo(currentId => [...currentId, id]);

    return updateTodoRename(id, newTitle)
      .then(data => {
        setTodos(currentTodos => {
          return currentTodos.map(todo => {
            if (todo.id === id) {
              return data;
            }

            return todo;
          });
        });

        setLoadingTodo(currentTodosId =>
          currentTodosId.filter(currentId => currentId !== id),
        );

        return true;
      })
      .catch(() => {
        setError(ErrorMessage.Update);

        setLoadingTodo(currentTodosId =>
          currentTodosId.filter(currentId => currentId !== id),
        );

        return false;
      });
  }

  function checkedTodoCompleted(id: number, completed: boolean) {
    setError('');

    setLoadingTodo(currentIds => [...currentIds, id]);

    updateTodoToggle(id, completed)
      .then(data => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (todo.id === id) {
              return data;
            }

            return todo;
          }),
        );

        setLoadingTodo(currentIds =>
          currentIds.filter(currentId => currentId !== id),
        );
      })
      .catch(() => {
        setError(ErrorMessage.Update);

        setLoadingTodo(currentIds =>
          currentIds.filter(currentId => currentId !== id),
        );
      });
  }

  function removeTodo(id: number) {
    setError('');

    setBlockedInput(true);
    setDeletingTodoId(currentIds => [...currentIds, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setBlockedInput(false);
        setDeletingTodoId(currentIds =>
          currentIds.filter(currentId => currentId !== id),
        );
      })
      .catch(() => {
        setError(ErrorMessage.Delete);
        setBlockedInput(false);
        setDeletingTodoId(currentIds =>
          currentIds.filter(currentId => currentId !== id),
        );
      });
  }

  async function clearCompleted() {
    setError('');
    setBlockedInput(true);

    const completedTodos = todos.filter(todo => todo.completed);
    const deleteRequests = completedTodos.map(todo => deleteTodo(todo.id));

    setDeletingTodoId(completedTodos.map(todo => todo.id));

    const results = await Promise.allSettled(deleteRequests);

    const successfullyDeletedTodos = results
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return completedTodos[index];
        }

        return null;
      })
      .filter((todo): todo is Todo => todo !== null);

    const successfullyDeletedTodoIds = successfullyDeletedTodos.map(
      todo => todo.id,
    );

    setDeletingTodoId(currentIds =>
      currentIds.filter(id => {
        return !successfullyDeletedTodoIds.includes(id);
      }),
    );

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfullyDeletedTodos.includes(todo)),
    );
    setBlockedInput(false);

    const isRejected = results.some(result => result.status === 'rejected');

    if (isRejected) {
      setError(ErrorMessage.Delete);
    }
  }

  useEffect(() => {
    setError('');

    setIsLoading(true);

    getTodos()
      .then(data => {
        setTodos(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError(ErrorMessage.Load);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (error === '') {
      return;
    }

    if (timerError.current !== null) {
      clearTimeout(timerError.current);
    }

    timerError.current = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      if (timerError.current === null) {
        return;
      }

      clearTimeout(timerError.current);
    };
  }, [error]);

  return {
    todos,
    error,
    setError,
    allCompleted,
    completedAllTodos,
    todosCounter,
    hasCompletedTodos,
    blockedInput,
    tempTodo,
    deletingTodoId,
    handleAddTodo,
    checkedTodoCompleted,
    removeTodo,
    clearCompleted,
    loadingTodo,
    saveEdit,
    isLoading,
  };
};
