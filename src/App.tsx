import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todo';
import { Todo } from './types/Todo';

import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Filter } from './components/Filter';

export const FILTERS = {
  all: 'all',
  completed: 'completed',
  active: 'active',
} as const;

export type FilterType = (typeof FILTERS)[keyof typeof FILTERS];

enum ErrorMessages {
  LOAD = 'Unable to load todos',
  ADD = 'Unable to add a todo',
  DELETE = 'Unable to delete a todo',
  UPDATE = 'Unable to update a todo',
  EMPTY_TITLE = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FILTERS.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);

  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const nextTodoId = useRef(-1);

  const showError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const addLoadingId = (id: number) => {
    setLoadingIds(prev => {
      if (prev.includes(id)) {
        return prev;
      }

      return [...prev, id];
    });
  };

  const removeLoadingId = (id: number) => {
    setLoadingIds(prev => prev.filter(itemId => itemId !== id));
  };

  const loadTodos = useCallback(async () => {
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch {
      showError(ErrorMessages.LOAD);
    } finally {
      setIsLoadingTodos(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAddTodo = async (title: string): Promise<boolean> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessages.EMPTY_TITLE);

      return false;
    }

    setIsSubmitting(true);

    const tempTodoId = nextTodoId.current;

    nextTodoId.current -= 1;

    setTempTodo({
      id: tempTodoId,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    try {
      const newTodo = await createTodo({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);

      return true;
    } catch {
      showError(ErrorMessages.ADD);

      return false;
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    addLoadingId(todoId);

    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));

      newTodoInputRef.current?.focus();
    } catch {
      showError(ErrorMessages.DELETE);
    } finally {
      removeLoadingId(todoId);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    addLoadingId(todo.id);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev =>
        prev.map(currentTodo =>
          currentTodo.id === todo.id ? updatedTodo : currentTodo,
        ),
      );
    } catch {
      showError(ErrorMessages.UPDATE);
    } finally {
      removeLoadingId(todo.id);
    }
  };

  const handleToggleAll = async () => {
    const allTodosCompleted =
      todos.length > 0 && todos.every(todo => todo.completed);

    const newStatus = !allTodosCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    await Promise.all(todosToUpdate.map(todo => handleToggleTodo(todo)));
  };

  const handleRenameTodo = async (
    todoId: number,
    title: string,
  ): Promise<boolean> => {
    addLoadingId(todoId);

    try {
      const updatedTodo = await updateTodo(todoId, {
        title,
      });

      setTodos(prev =>
        prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );

      return true;
    } catch {
      showError(ErrorMessages.UPDATE);

      return false;
    } finally {
      removeLoadingId(todoId);
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === FILTERS.active) {
      return !todo.completed;
    }

    if (filter === FILTERS.completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const allTodosCompleted =
    todos.length > 0 && completedTodosCount === todos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {!isLoadingTodos && (
          <header className="todoapp__header">
            {todos.length > 0 && (
              <button
                type="button"
                className={classNames('todoapp__toggle-all', {
                  active: allTodosCompleted,
                })}
                data-cy="ToggleAllButton"
                onClick={handleToggleAll}
              />
            )}

            <NewTodo
              onSubmit={handleAddTodo}
              disabled={isSubmitting}
              inputRef={newTodoInputRef}
            />
          </header>
        )}

        {!isLoadingTodos && (todos.length > 0 || tempTodo) ? (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={handleDeleteTodo}
              onToggle={handleToggleTodo}
              onRename={handleRenameTodo}
              loadingIds={loadingIds}
              tempTodo={tempTodo}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosCount}
                {activeTodosCount === 1 ? ' item' : ' items'} left
              </span>

              <Filter currentFilter={filter} onFilterChange={setFilter} />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={completedTodosCount === 0}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        ) : null}

        {isLoadingTodos && (
          <NewTodo
            onSubmit={handleAddTodo}
            disabled={true}
            inputRef={newTodoInputRef}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
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
