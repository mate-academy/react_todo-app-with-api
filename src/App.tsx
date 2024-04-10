/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { TodoElement } from './components/TodoElement';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number>(0);
  const [toggleAll, setToggleAll] = useState<boolean>(false);

  const inputAutoFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(todosData => {
        setTodos(todosData);
        setError('');
      })
      .catch(() => {
        setError('Unable to load todos');
      });

    const timeoutId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    inputAutoFocus.current?.focus();
  }, [error, todos.length]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = (filter: Filter): Todo[] => {
    switch (filter) {
      case Filter.All:
        return todos;

      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const filteredTodos = filterTodos(selectedFilter);

  const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    setIsSubmitting(true);
    setTempTodo({ id: 0, title, userId, completed });

    return createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo] as Todo[]);
        setTodoTitle('');
        setError('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const removeTodo = (todoId: number) => {
    setIsSubmitting(true);
    setDeletedTodoId(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(err => {
        setError('Unable to delete a todo');
        throw err;
      })
      .finally(() => {
        setIsSubmitting(false);
        setDeletedTodoId(0);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setIsSubmitting(true);

    return patchTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            currentTodo => currentTodo.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todo as Todo);

          return newTodos;
        });
      })
      .catch(err => {
        setError('Unable to update a todo');
        throw err;
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleFromSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    addTodo({ title: trimmedTitle, userId: USER_ID, completed: false });
  };

  const todosCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  const handleClearCompletedClick = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completedTodos.map(todo => removeTodo(todo.id)));

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAllClick = async () => {
    const newToggleAll = !toggleAll;

    setToggleAll(newToggleAll);

    try {
      await Promise.all(
        todos.map(todo =>
          updateTodo({
            ...todo,
            completed: newToggleAll,
          }),
        ),
      );
    } catch {
      setError('Unable to update todos');
      setToggleAll(!newToggleAll);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', { active: toggleAll })}
            data-cy="ToggleAllButton"
            onClick={handleToggleAllClick}
          />

          <form onSubmit={handleFromSubmit}>
            <input
              ref={inputAutoFocus}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={event => setTodoTitle(event?.target.value)}
              disabled={isSubmitting}
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              isSubmitting={isSubmitting}
              deletedTodoId={deletedTodoId}
              handleRemoveTodo={removeTodo}
              handleUpdateTodo={updateTodo}
            />

            {tempTodo && (
              <TodoElement
                todo={tempTodo}
                deletedTodoId={deletedTodoId}
                handleRemoveTodo={removeTodo}
                isSubmitting={isSubmitting}
                handleUpdateTodo={updateTodo}
              />
            )}

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todosCount} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: selectedFilter === Filter.All,
                  })}
                  data-cy="FilterLinkAll"
                  onClick={() => setSelectedFilter(Filter.All)}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: selectedFilter === Filter.Active,
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setSelectedFilter(Filter.Active)}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: selectedFilter === Filter.Completed,
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setSelectedFilter(Filter.Completed)}
                >
                  Completed
                </a>
              </nav>
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!hasCompleted}
                onClick={handleClearCompletedClick}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {error}
      </div>
    </div>
  );
};
