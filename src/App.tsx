/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo as TodoType } from './types/Todo';
import { Filter } from './components/Filter';
import { Todo } from './components/Todo';
import { TodoList } from './components/TodoList';
import { NewTodo, NewTodoHandle } from './components/NewTodo';

export const FILTERS = {
  all: 'all',
  completed: 'completed',
  active: 'active',
} as const;

type FilterType = (typeof FILTERS)[keyof typeof FILTERS];

type TodoUpdate = Partial<Pick<TodoType, 'title' | 'completed'>>;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[] | null>(null);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [processings, setProcessings] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FILTERS.all);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newTodoRef = useRef<NewTodoHandle>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setTodos([]);
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isLoading = todos === null;
  const loadedTodos = todos || [];

  const visibleTodos = loadedTodos.filter(todo => {
    if (filter === FILTERS.active) {
      return !todo.completed;
    }

    if (filter === FILTERS.completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodos = loadedTodos.filter(todo => !todo.completed);
  const completedTodos = loadedTodos.filter(todo => todo.completed);

  const allCompleted =
    loadedTodos.length > 0 && completedTodos.length === loadedTodos.length;

  const handleInvalidTitle = () => {
    setErrorMessage('Title should not be empty');
  };

  const addTodo = async (title: string): Promise<boolean> => {
    if (!title.trim()) {
      handleInvalidTitle();

      return false;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const createdTodo = await createTodo(title);

      setTodos(current => [...(current || []), createdTodo]);
      setTempTodo(null);

      return true;
    } catch {
      setTempTodo(null);
      setErrorMessage('Unable to add a todo');

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTodoById = (id: number) => {
    setErrorMessage('');

    setProcessings(current =>
      current.includes(id) ? current : [...current, id],
    );

    deleteTodo(id)
      .then(() => {
        setTodos(current => current?.filter(todo => todo.id !== id) || []);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessings(current => current.filter(todoId => todoId !== id));
        newTodoRef.current?.focus();
      });
  };

  const updateOneTodo = async (
    id: number,
    data: TodoUpdate,
  ): Promise<boolean> => {
    const currentTodo = loadedTodos.find(todo => todo.id === id);

    if (!currentTodo) {
      return false;
    }

    setErrorMessage('');

    setProcessings(current =>
      current.includes(id) ? current : [...current, id],
    );

    try {
      const updatedTodo = await updateTodo(id, data);

      setTodos(
        current =>
          current?.map(todo => (todo.id === id ? updatedTodo : todo)) || [],
      );

      return true;
    } catch {
      setErrorMessage('Unable to update a todo');

      return false;
    } finally {
      setProcessings(current => current.filter(todoId => todoId !== id));
    }
  };

  const toggleAll = async () => {
    const targetStatus = !allCompleted;

    const todosToUpdate = loadedTodos.filter(
      todo => todo.completed !== targetStatus,
    );

    await Promise.all(
      todosToUpdate.map(todo =>
        updateOneTodo(todo.id, { completed: targetStatus }),
      ),
    );
  };

  const clearCompleted = () => {
    setErrorMessage('');

    const completedIds = completedTodos.map(todo => todo.id);

    setProcessings(current => [...new Set([...current, ...completedIds])]);

    Promise.allSettled(completedIds.map(id => deleteTodo(id))).then(results => {
      const successfulIds = completedIds.filter(
        (_, index) => results[index].status === 'fulfilled',
      );

      const hasError = results.some(result => result.status === 'rejected');

      setTodos(
        current =>
          current?.filter(todo => !successfulIds.includes(todo.id)) || [],
      );

      if (hasError) {
        setErrorMessage('Unable to delete a todo');
      }

      setProcessings(current =>
        current.filter(id => !completedIds.includes(id)),
      );

      newTodoRef.current?.focus();
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {loadedTodos.length > 0 ? (
          <header className="todoapp__header">
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
              disabled={processings.length > 0}
            />

            <NewTodo
              ref={newTodoRef}
              onAdd={addTodo}
              onInvalid={handleInvalidTitle}
              isSubmitting={isSubmitting}
            />
          </header>
        ) : (
          <NewTodo
            ref={newTodoRef}
            onAdd={addTodo}
            onInvalid={handleInvalidTitle}
            isSubmitting={isSubmitting}
          />
        )}

        {isLoading && (
          <section className="todoapp__main" data-cy="TodoList">
            <div className="todo">
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </section>
        )}

        {!isLoading && loadedTodos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            processings={processings}
            onDelete={deleteTodoById}
            onUpdate={updateOneTodo}
          />
        )}

        {!isLoading && tempTodo && (
          <section className="todoapp__main">
            <Todo
              todo={tempTodo}
              isLoading
              onDelete={() => {}}
              onUpdate={async () => false}
            />
          </section>
        )}

        {!isLoading && loadedTodos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            <Filter filter={filter} setFilter={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
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
