/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { useErrorMessage } from './hooks/useErrorMessage';
import { FilterTodos, Todo } from './types/Todo';
import {
  getTodoError,
  todosService,
  TodosServiceError,
  USER_ID,
} from './api/todos';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';
import { getFilteredTodos } from './utils/helpers';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState<FilterTodos>(FilterTodos.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const { errorMessage, setErrorMessage, resetErrorMessage } =
    useErrorMessage();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isTodoLoading = useCallback(
    (todoId: number) => loadingTodoIds.includes(todoId),
    [loadingTodoIds],
  );

  const addLoadingId = useCallback((todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);
  }, []);

  const removeLoadingId = useCallback((todoId: number) => {
    setLoadingTodoIds(current => current.filter(id => id !== todoId));
  }, []);

  const handleDeleteTodo = useCallback(
    (todoId: number) => {
      addLoadingId(todoId);

      todosService
        .delete(todoId)
        .then(() => {
          setTodos(current => current.filter(todo => todo.id !== todoId));
        })
        .catch(() => {
          setErrorMessage(getTodoError(TodosServiceError.UnableToDeleteTodo));
        })
        .finally(() => {
          removeLoadingId(todoId);
          setTimeout(() => inputRef.current?.focus(), 0);
        });
    },
    [addLoadingId, removeLoadingId, setErrorMessage],
  );

  const handleAddTodo = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        setErrorMessage(getTodoError(TodosServiceError.TitleShouldNotBeEmpty));

        return;
      }

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      todosService
        .add(trimmedTitle)
        .then(createdTodo => {
          setTodos(current => [...current, createdTodo]);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage(getTodoError(TodosServiceError.UnableToAddTodo));
        })
        .finally(() => {
          setTempTodo(null);
          setTimeout(() => inputRef.current?.focus(), 0);
        });
    },
    [title, setErrorMessage],
  );

  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  }, [todos, handleDeleteTodo]);

  useEffect(() => {
    todosService
      .list()
      .then(currentTodos => setTodos(currentTodos))
      .catch(() => {
        setErrorMessage(getTodoError(TodosServiceError.UnableToLoadTodos));
      });
  }, [setErrorMessage]);

  const showTodosAndFooter = todos.length > 0;
  const showToggleAllButton = todos.length > 0;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const allCompleted = todos.every(todo => todo.completed);

  const filteredTodos = getFilteredTodos(todos, filterBy);

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(current => {
      return current.map(todo => {
        return todo.id === updatedTodo.id ? updatedTodo : todo;
      });
    });
  };

  const handleToggleAll = () => {
    const newStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    todosToUpdate.forEach(todo => {
      addLoadingId(todo.id);

      todosService
        .update(todo.id, { completed: newStatus })
        .then(handleUpdateTodo)
        .catch(() => {
          setErrorMessage(getTodoError(TodosServiceError.UnableToUpdateTodo));
        })
        .finally(() => {
          removeLoadingId(todo.id);
        });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {showToggleAllButton && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {filteredTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  loading={isTodoLoading(todo.id)}
                  setErrorMessage={setErrorMessage}
                  addLoadingId={addLoadingId}
                  removeLoadingId={removeLoadingId}
                  onUpdateTodo={handleUpdateTodo}
                />
              </CSSTransition>
            ))}

            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoItem
                  todo={tempTodo}
                  loading={true}
                  onDelete={() => {}}
                  setErrorMessage={setErrorMessage}
                  addLoadingId={addLoadingId}
                  removeLoadingId={removeLoadingId}
                  onUpdateTodo={handleUpdateTodo}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {showTodosAndFooter && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filterBy === FilterTodos.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => {
                  setFilterBy(FilterTodos.All);
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filterBy === FilterTodos.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => {
                  setFilterBy(FilterTodos.Active);
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filterBy === FilterTodos.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => {
                  setFilterBy(FilterTodos.Completed);
                }}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        notification={errorMessage}
        onClear={resetErrorMessage}
      />
    </div>
  );
};
