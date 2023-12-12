import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { USER_ID, useAppState } from '../AppState/AppState';
import { handleErrorMessage } from '../function/handleErrorMessage';
import { newPost, upDateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { getIncompleteTodosCount } from '../function/getIncompleteTodosCount';

export const HeaderInput: React.FC = () => {
  const {
    todos,
    loading,
    todosFilter,
    setTodos,
    setTodosFilter,
    setErrorNotification,
    setLoading,
    setTempTodo,
    setDeleteLoadingMap,
  } = useAppState();

  const [newTodo, setNewTodo] = useState<string>('');

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const incompleteTodosCount = getIncompleteTodosCount(todos);

  useEffect(() => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, [todos]);

  const handleSaveTodo = async () => {
    if (!newTodo.trim()) {
      setErrorNotification('Title should not be empty');

      return;
    }

    setLoading(true);
    const title = newTodo.trim();

    const tempTodo: Todo = {
      id: 0,
      title,
      completed: false,
    };

    setTempTodo(tempTodo);

    try {
      const response = await newPost(USER_ID, title);

      setTodos(
        (prevTodos) => (prevTodos ? [...prevTodos, response] : [response]),
      );

      setTodosFilter(
        (prevTodos) => (prevTodos ? [...prevTodos, response] : [response]),
      );

      setNewTodo('');
    } catch (error) {
      handleErrorMessage(error as Error, setErrorNotification);
      const errorNotificationTimeout = setTimeout(() => {
        setErrorNotification(null);
      }, 3000);

      clearTimeout(errorNotificationTimeout);
      throw error;
    } finally {
      setTempTodo(null);
      setLoading(false);
    }
  };

  const handleStatusToggleALL = async () => {
    let statusToggleALL: Todo[] | null = null;
    let notCompletedTodoIds: number[] | null = null;

    if (todos) {
      statusToggleALL = todos.filter((todo) => todo.completed === false);
    }

    if (statusToggleALL) {
      if (!statusToggleALL.length) {
        statusToggleALL = todos;
      }
    }

    if (statusToggleALL) {
      notCompletedTodoIds = statusToggleALL
        .filter(todo => todo.id !== null)
        .map(todo => todo.id as number);
    }

    setDeleteLoadingMap((prevLoadingMap) => {
      const newState = { ...prevLoadingMap };

      if (notCompletedTodoIds) {
        notCompletedTodoIds.forEach((id) => {
          if (id) {
            newState[id] = true;
          }
        });
      }

      return newState;
    });

    if (!loading) {
      try {
        setLoading(true);

        if (!todosFilter) {
          setErrorNotification('Unable to update a todo');

          return;
        }

        let updatedTodos: Todo[] | null = null;

        if (statusToggleALL) {
          updatedTodos = await Promise.all(
            statusToggleALL.map(async (todo: Todo) => {
              const updatedTodo = { ...todo, completed: !todo.completed };
              const { id, completed } = updatedTodo;

              if (!id) {
                setErrorNotification('Unable to update a todo');
              }

              if (id) {
                await upDateTodo(id, completed);
              }

              return updatedTodo;
            }),
          );
        }

        setTodosFilter((prevTodo: Todo[] | null) => {
          return prevTodo
            ? prevTodo.map((todo) => {
              if (updatedTodos) {
                const updatedTodo = updatedTodos.find(
                  (updated) => updated.id === todo.id,
                );

                return updatedTodo || todo;
              }

              return todo;
            })
            : updatedTodos;
        });

        setTodos((prevTodo: Todo[] | null) => {
          return prevTodo
            ? prevTodo.map((todo) => {
              let updatedTodo;

              if (updatedTodos) {
                updatedTodo = updatedTodos.find(
                  (updated) => updated.id === todo.id,
                );
              }

              return updatedTodo || todo;
            })
            : updatedTodos;
        });
      } catch (error: any) {
        error.message = 'Unable to update a todo';
        handleErrorMessage(error as Error, setErrorNotification);
        const errorNotificationTimeout = setTimeout(() => {
          setErrorNotification(null);
        }, 3000);

        clearTimeout(errorNotificationTimeout);
      } finally {
        setDeleteLoadingMap((prevLoadingMap) => {
          const newState = { ...prevLoadingMap };

          if (notCompletedTodoIds) {
            notCompletedTodoIds.forEach((id) => {
              if (id) {
                newState[id] = false;
              }
            });
          }

          return newState;
        });

        setLoading(false);
      }
    } else {
      setErrorNotification('Unable to update a todo');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: !incompleteTodosCount,
          },
        )}
        data-cy="ToggleAllButton"
        aria-label="todo"
        onClick={
          (e) => {
            e.preventDefault();
            handleStatusToggleALL();
          }
        }

      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveTodo();
        }}
      >

        <input
          ref={newTodoFieldRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
          value={newTodo}
          disabled={loading}
        />
      </form>
    </header>
  );
};
