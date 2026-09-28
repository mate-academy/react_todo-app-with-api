/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoRow } from './components/TodoRow';
import { ErrorNotificator } from './components/ErrorNotificator';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.all);

  const inputRef = useRef<HTMLInputElement>(null);

  function showErrorMessage(errorMessage: string) {
    setErrorMessages(currentErorrMessages => [
      ...currentErorrMessages,
      errorMessage,
    ]);

    setTimeout(() => {
      setErrorMessages(currentErorrMessages =>
        currentErorrMessages.filter(
          currentMessage => currentMessage !== errorMessage,
        ),
      );
    }, 3000);
  }

  useEffect(() => {
    setErrorMessages([]);
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => {
        showErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter(currentTodo => {
      return (
        filter === FilterStatus.all ||
        (filter === FilterStatus.completed && currentTodo.completed) ||
        (filter === FilterStatus.active && !currentTodo.completed)
      );
    });
  }, [filter, todos]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(currentTodo => currentTodo.completed === false).length;
  }, [todos]);

  const completedTodosCount = useMemo(() => {
    return todos.filter(currentTodo => currentTodo.completed === true).length;
  }, [todos]);

  const areAllCompleted = useMemo(
    () => todos.every(currentTodo => currentTodo.completed === true),
    [todos],
  );

  function handleOnSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedTitle = newTodoTitle.trim();

    setIsLoading(true);
    if (!normalizedTitle) {
      showErrorMessage('Title should not be empty');
      setIsLoading(false);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    setErrorMessages([]);

    addTodo(newTodo)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        showErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  }

  function handleOnDelete(todoId: number) {
    setProcessingIds(currentProcessingIds => [...currentProcessingIds, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== todoId),
        );

        return true;
      })
      .catch(() => {
        showErrorMessage('Unable to delete a todo');

        return false;
      })
      .finally(() => {
        setProcessingIds(currentProcessingIds =>
          currentProcessingIds.filter(currentId => currentId !== todoId),
        );
      });
  }

  function handleClearCompleted() {
    return Promise.allSettled(
      todos
        .filter(currentTodo => currentTodo.completed === true)
        .map(completedTodo => handleOnDelete(completedTodo.id)),
    );
  }

  function handleOnToggle(todo: Todo) {
    setProcessingIds(currentProcessingIds => [
      ...currentProcessingIds,
      todo.id,
    ]);

    const updatedTodo = { ...todo, completed: !todo.completed };

    return updateTodo(updatedTodo)
      .then(patchedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === patchedTodo.id ? patchedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        showErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setProcessingIds(currentProcessingIds =>
          currentProcessingIds.filter(currentId => currentId !== todo.id),
        );
      });
  }

  function handleOnRename(todo: Todo, newTitle: string) {
    setProcessingIds(currentProcessingIds => [
      ...currentProcessingIds,
      todo.id,
    ]);

    const updatedTodo = { ...todo, title: newTitle.trim() };

    return updateTodo(updatedTodo)
      .then(patchedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === patchedTodo.id ? patchedTodo : currentTodo,
          ),
        );

        return true;
      })
      .catch(() => {
        showErrorMessage('Unable to update a todo');

        return false;
      })
      .finally(() => {
        setProcessingIds(currentProcessingIds =>
          currentProcessingIds.filter(currentId => currentId !== todo.id),
        );
      });
  }

  function handleToggleAll() {
    const targetStatus = !areAllCompleted;

    return Promise.allSettled(
      todos
        .filter(currentTodo => currentTodo.completed !== targetStatus)
        .map(updatedTodo => handleOnToggle(updatedTodo)),
    );
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!isLoading && todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', { active: areAllCompleted })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleOnSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={isLoading}
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos.map(currentTodo => (
              <CSSTransition
                key={currentTodo.id}
                timeout={300}
                classNames="item"
              >
                <TodoRow
                  key={currentTodo.id}
                  todo={currentTodo}
                  isProcessing={processingIds.includes(currentTodo.id)}
                  onDelete={() => handleOnDelete(currentTodo.id)}
                  onToggle={() => handleOnToggle(currentTodo)}
                  onUpdate={newTitle => handleOnRename(currentTodo, newTitle)}
                />
              </CSSTransition>
            ))}

            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoRow
                  key={tempTodo.id}
                  todo={tempTodo}
                  isProcessing={true}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filter === FilterStatus.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(FilterStatus.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filter === FilterStatus.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(FilterStatus.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filter === FilterStatus.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(FilterStatus.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
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
        )}
      </div>

      <ErrorNotificator
        errorMessages={errorMessages}
        onClose={() => setErrorMessages([])}
      />
    </div>
  );
};
