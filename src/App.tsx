/* eslint-disable prettier/prettier */

import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!USER_ID) {
      setIsLoadingTodos(false);

      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setIsLoadingTodos(false);
      });
  }, []);

  useEffect(() => {
    if (tempTodo === null && shouldFocusInput) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      setShouldFocusInput(false);
    }
  }, [tempTodo, shouldFocusInput]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [errorMessage]);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      case Filter.All:
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(
    todo => !todo.completed,
  ).length;

  const completedTodosCount = todos.filter(
    todo => todo.completed,
  ).length;

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleAddTodo = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      return;
    }

    setErrorMessage('');

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    createTodo(trimmedTitle)
      .then(createdTodo => {
        setTodos(currentTodos => [
          ...currentTodos,
          createdTodo,
        ]);

        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setShouldFocusInput(true);
      });
  };

  const handleDeleteTodo = (todoId: number): Promise<boolean> => {
    setErrorMessage('');

    setDeletingIds(currentIds => [
      ...currentIds,
      todoId,
    ]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        setShouldFocusInput(true);

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');

        return false;
      })
      .finally(() => {
        setDeletingIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const handleToggleTodo = (
    todoId: number,
    completed: boolean,
  ) => {
    setErrorMessage('');

    setUpdatingIds(currentIds => [
      ...currentIds,
      todoId,
    ]);

    updateTodo(todoId, { completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const handleToggleAll = () => {
    const newCompletedStatus = !allTodosCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    if (!todosToUpdate.length) {
      return;
    }

    setErrorMessage('');

    setUpdatingIds(currentIds => [
      ...currentIds,
      ...todosToUpdate.map(todo => todo.id),
    ]);

    Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, {
          completed: newCompletedStatus,
        }),
      ),
    )
      .then(results => {
        let hasError = false;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const updatedTodo = result.value;

            setTodos(currentTodos =>
              currentTodos.map(todo =>
                todo.id === todosToUpdate[index].id
                  ? updatedTodo
                  : todo,
              ),
            );
          } else {
            hasError = true;
          }
        });

        if (hasError) {
          setErrorMessage('Unable to update a todo');
        }
      })
      .finally(() => {
        const ids = todosToUpdate.map(todo => todo.id);

        setUpdatingIds(currentIds =>
          currentIds.filter(id => !ids.includes(id)),
        );
      });
  };

  const handleUpdateTodo = (
    todoId: number,
    newTitle: string,
  ): Promise<boolean> => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      return handleDeleteTodo(todoId);
    }

    setErrorMessage('');

    setUpdatingIds(currentIds => [
      ...currentIds,
      todoId,
    ]);

    return updateTodo(todoId, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? updatedTodo : todo,
          ),
        );

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        return false;
      })
      .finally(() => {
        setUpdatingIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (!completedTodos.length) {
      return;
    }

    setErrorMessage('');

    setDeletingIds(
      completedTodos.map(todo => todo.id),
    );

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    ).then(results => {
      const deletedIds: number[] = [];
      let hasError = false;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          deletedIds.push(completedTodos[index].id);
        } else {
          hasError = true;
        }
      });

      if (deletedIds.length) {
        setTodos(currentTodos =>
          currentTodos.filter(
            todo => !deletedIds.includes(todo.id),
          ),
        );
      }

      if (hasError) {
        setErrorMessage('Unable to delete a todo');
      }

      setDeletingIds([]);

      if (deletedIds.length) {
        setShouldFocusInput(true);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const shouldShowTodoList =
    todos.length > 0 || tempTodo !== null;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          onSubmit={handleAddTodo}
          value={title}
          onChange={setTitle}
          disabled={tempTodo !== null}
          allTodosCompleted={allTodosCompleted}
          onToggleAll={handleToggleAll}
          showToggleAll={!isLoadingTodos && todos.length > 0}
        />

        {shouldShowTodoList && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletingIds={deletingIds}
            updatingIds={updatingIds}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onUpdate={handleUpdateTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          !errorMessage ? 'hidden' : ''
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
