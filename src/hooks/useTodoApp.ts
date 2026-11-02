import { useEffect, useMemo, useRef, useState } from 'react';
import { Todo as TodoType } from '../types/Todo';
import { DefaultFilter } from '../types/DefaultFilter';
import { getVisibleTodos } from '../utils/getVisibleTodos';
import { TempTodo } from '../types/TempTodo';
import { deleteTodo, getTodos, postTodo, updateTodo } from '../api/todos';
import { errorMessageOptions } from '../constants/errorMessageOptions';

export const useTodoApp = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const timerId = useRef<ReturnType<typeof setTimeout>>();
  const [selectedFilter, setSelectedFilter] = useState<DefaultFilter>(
    DefaultFilter.All,
  );
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [todosToLoad, setTodosToLoad] = useState<number[]>([]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const formFocus = useRef(false);

  const filteredTodos = useMemo(
    () => getVisibleTodos(selectedFilter, todos),
    [selectedFilter, todos],
  );

  const completedTodosAvailability = todos.some(todo => todo.completed);

  const allTodosCompleted = useMemo(() => {
    const currentActiveTodos = todos.reduce((prev, todo) => {
      if (!todo.completed) {
        return prev + 1;
      }

      return prev;
    }, 0);

    if (todos.length > 0 && currentActiveTodos === 0) {
      return true;
    }

    return false;
  }, [todos]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(errorMessageOptions.loadTodos));
  }, []);

  const handleErrorMessageRemoval = () => {
    clearTimeout(timerId.current);
    setErrorMessage('');
  };

  useEffect(() => {
    if (errorMessage !== '') {
      clearTimeout(timerId.current);

      timerId.current = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  const showError = (newError: string) => {
    if (errorMessage === newError) {
      clearTimeout(timerId.current);

      timerId.current = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    setErrorMessage(newError);
  };

  const handleNewTodo = async (inputValue: string) => {
    if (!inputValue) {
      showError(errorMessageOptions.emptyTitle);

      return false;
    }

    setDisabledInput(true);

    setTempTodo({ id: 0, title: inputValue });

    let result = false;

    await postTodo(inputValue)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        handleErrorMessageRemoval();
        result = true;
      })
      .catch(() => {
        showError(errorMessageOptions.newTodo);
      })
      .finally(() => {
        setDisabledInput(false);
        setTempTodo(null);
      });

    return result;
  };

  const handleTodoDeletion = (status: boolean, todoId?: number) => {
    if (!status) {
      showError(errorMessageOptions.deleteTodo);

      return;
    }

    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    formFocus.current = !formFocus.current;
  };

  const handleCompletedTodosDeletion = async () => {
    const todosToDeleteIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setTodosToLoad(todosToDeleteIds);

    const results = await Promise.allSettled(
      todosToDeleteIds.map(id => deleteTodo(id)),
    );

    if (results.some(({ status }) => status === 'rejected')) {
      showError(errorMessageOptions.deleteTodo);
    }

    setTodosToLoad(() => []);

    let filterDeletedTodos = [...todos];

    results.forEach(({ status }, index) => {
      if (status === 'fulfilled') {
        filterDeletedTodos = filterDeletedTodos.filter(
          todo => todo.id !== todosToDeleteIds[index],
        );
      }
    });

    setTodos(() => filterDeletedTodos);
    formFocus.current = true;
  };

  const setChangedTodoStatus = (todoId: number, newStatus: boolean) => {
    setTodos(currentTodos =>
      currentTodos.map(todo => {
        if (todoId === todo.id) {
          const updatedTodo = { ...todo };

          updatedTodo.completed = newStatus;

          return updatedTodo;
        }

        return todo;
      }),
    );
  };

  const handleTodoStatusChange = async (
    todoId: number,
    currentStatus: boolean,
  ): Promise<boolean> => {
    let result = false;

    await updateTodo(todoId, { completed: !currentStatus })
      .then(() => {
        setChangedTodoStatus(todoId, !currentStatus);

        result = true;
      })
      .catch(() => {
        result = false;
        showError(errorMessageOptions.updateTodo);
      });

    return result;
  };

  const handleTodosCompletions = async () => {
    if (allTodosCompleted) {
      setTodosToLoad(todos.map(todo => todo.id));

      const updatesResult = await Promise.allSettled(
        todos.map(todo => updateTodo(todo.id, { completed: !todo.completed })),
      );

      setTodosToLoad([]);

      let promiseFailed = false;

      updatesResult.map((promiseCallResult, index) => {
        if (promiseCallResult.status === 'fulfilled') {
          setChangedTodoStatus(todos[index].id, !todos[index].completed);
        } else {
          promiseFailed = true;
        }
      });

      if (promiseFailed) {
        showError(errorMessageOptions.updateTodo);
      }
    } else {
      setTodosToLoad(
        todos.reduce((prev: number[], todo) => {
          if (!todo.completed) {
            prev.push(todo.id);
          }

          return prev;
        }, []),
      );

      const updatesResult = await Promise.allSettled(
        todos.map(todo => {
          if (todo.completed === false) {
            return updateTodo(todo.id, { completed: !todo.completed });
          }

          return;
        }),
      );

      setTodosToLoad([]);
      let promiseFailed = false;

      updatesResult.map((promiseCallResult, index) => {
        if (
          promiseCallResult.status === 'fulfilled' &&
          todos[index].completed === false
        ) {
          setChangedTodoStatus(todos[index].id, !todos[index].completed);
        }

        if (promiseCallResult.status !== 'fulfilled') {
          promiseFailed = true;
        }
      });

      if (promiseFailed) {
        showError(errorMessageOptions.updateTodo);
      }
    }
  };

  const handleSuccessTitleUpdate = (todoId: number, newTitle: string) => {
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, title: newTitle };
        }

        return todo;
      });
    });
  };

  const handleFailedTitleUpdate = () => {
    showError(errorMessageOptions.updateTodo);
  };

  return {
    todos,
    allTodosCompleted,
    disabledInput,
    formFocus,
    tempTodo,
    todosToLoad,
    activeTodosCount,
    filteredTodos,
    selectedFilter,
    completedTodosAvailability,
    errorMessage,
    setSelectedFilter,
    handleNewTodo,
    handleTodoStatusChange,
    handleTodosCompletions,
    handleSuccessTitleUpdate,
    handleFailedTitleUpdate,
    handleCompletedTodosDeletion,
    handleTodoDeletion,
    handleErrorMessageRemoval,
  };
};
