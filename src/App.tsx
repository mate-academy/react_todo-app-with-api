/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  memo,
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import cn from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/FilterTypes';
import { ErrorNotifications } from './components/ErrorNotifications';
import { TodoItem } from './components/TodoItem';
import { getFilteredTodos } from './helpers/getFiltereTodos';
import { useErrors } from './hooks/useErrors';

export const App: React.FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilterType, setSelectedFilterType] = useState(FilterTypes.ALL);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [processings, setProcessings] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [showErrorMessage, closeError, errorMessages] = useErrors([]);

  const handleFilterOptionClick = (newOption: FilterTypes) => {
    if (selectedFilterType !== newOption) {
      setSelectedFilterType(newOption);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setNewTodoTitle('');
      showErrorMessage("Title can't be empty");

      return;
    }

    if (user) {
      const newTodo = {
        userId: user.id,
        title: newTodoTitle.trim(),
        completed: false,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      addTodo(newTodo)
        .then(uploadedTodo => setTodos(prev => ([
          ...prev,
          uploadedTodo,
        ])))
        .catch(() => showErrorMessage('Unable to add a todo`'))
        .finally(() => {
          setTempTodo(null);
          setNewTodoTitle('');
        });
    }
  };

  const handleDeleteTodo = useCallback((id: number) => {
    setProcessings(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => (
          todo.id !== id
        )));
      })
      .catch(() => {
        showErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessings(prevProcessings => {
          return prevProcessings.filter(deletingId => deletingId !== id);
        });
      });
  }, []);

  const handleClearCompletedClick = () => {
    const completedTodosIds = todos.reduce((ids: number[], todo) => {
      return todo.completed
        ? [...ids, todo.id]
        : ids;
    }, []);

    setProcessings(prev => [...prev, ...completedTodosIds]);

    const deletePromises: Promise<unknown>[] = completedTodosIds.map(id => {
      return deleteTodo(id);
    });

    Promise.all(deletePromises).then(() => {
      setTodos(prev => prev.filter(({ id }) => {
        return !completedTodosIds.includes(id);
      }));
    });
  };

  const handleTodoUpdate = useCallback((changedTodo: Todo) => {
    const { id, title, completed } = changedTodo;

    setProcessings(prev => [...prev, id]);

    updateTodo(id, {
      title,
      completed,
    })
      .then((updatedTodo) => {
        setTodos(prevTodos => prevTodos.map(todo => {
          if (todo.id === updatedTodo.id) {
            return updatedTodo;
          }

          return todo;
        }));
      })
      .catch(() => {
        showErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setProcessings(prevProcessings => {
          return prevProcessings.filter(deletingId => deletingId !== id);
        });
      });
  }, []);

  const handleToogleAllClick = () => {
    const areAllTodosCompleted = todos.every(todo => todo.completed);

    const todosIdsForUpdate: number[] = areAllTodosCompleted
      ? todos.map(todo => todo.id)
      : todos.reduce((ids: number[], todo) => {
        return todo.completed
          ? ids
          : [...ids, todo.id];
      }, []);

    setProcessings(prev => [...prev, ...todosIdsForUpdate]);

    const updatePromises: Promise<Todo>[] = todosIdsForUpdate.map((id) => {
      return updateTodo(id, { completed: !areAllTodosCompleted });
    });

    Promise.all(updatePromises).then(updatedTodos => {
      const updatedTodosIds = updatedTodos.map(todo => todo.id);

      setTodos(prevTodos => {
        return prevTodos.map(prevTodo => {
          if (updatedTodosIds.includes(prevTodo.id)) {
            return updatedTodos
              .find(updatedTodo => updatedTodo.id === prevTodo.id)
                || prevTodo;
          }

          return prevTodo;
        });
      });
    }).finally(() => {
      setProcessings(prev => prev
        .filter(id => !todosIdsForUpdate.includes(id)));
    });
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then((loadedTodos) => {
          setTodos(loadedTodos);
        })
        .catch(() => {
          showErrorMessage('Can\'t load todos!');
        });
    }
  }, []);

  const visibleTodoos = useMemo(() => {
    return getFilteredTodos(todos, selectedFilterType);
  }, [todos, selectedFilterType]);

  const filterOptions = useMemo(() => Object.values(FilterTypes), []);

  const activeItemsNumber = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={cn(
              'todoapp__toggle-all',
              { active: todos.every(todo => todo.completed) },
            )}
            onClick={handleToogleAllClick}
          />

          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={!!tempTodo}
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {todos.length > 0 && (
                <TodoList
                  todos={visibleTodoos}
                  onDeleteTodo={handleDeleteTodo}
                  processings={processings}
                  onTodoUpdate={handleTodoUpdate}
                />
              )}

              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  onUpdate={handleTodoUpdate}
                  onDelete={handleDeleteTodo}
                  isProcessing
                />
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${activeItemsNumber} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                {filterOptions.map(option => (
                  <a
                    key={option}
                    data-cy="FilterLinkAll"
                    href="#/"
                    className={cn(
                      'filter__link',
                      { selected: selectedFilterType === option },
                    )}
                    onClick={() => handleFilterOptionClick(option)}
                  >
                    {option}
                  </a>
                ))}
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                disabled={activeItemsNumber === todos.length}
                onClick={handleClearCompletedClick}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotifications
        errorMessages={errorMessages}
        onCloseBtnClick={closeError}
      />
    </div>
  );
});
