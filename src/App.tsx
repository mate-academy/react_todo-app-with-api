/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { TodoItem } from './components/Todo';
import { DispatchContext, StateContext }
  from './components/TodosContext/TodosContext';
import { FilterTypes } from './types/FilterTypes';
import { ActionType } from './types/ActionType';

const USER_ID = 11562;

export const App: React.FC = () => {
  const state = useContext(StateContext);

  const reducer = useContext(DispatchContext);

  const { todos } = state;

  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case FilterTypes.active:
        return todos.filter(todo => !todo.completed);

      case FilterTypes.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filter]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        reducer({ type: ActionType.GetTodos, payload: response });
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } else {
      const newTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      };

      setIsDisabled(true);
      setTempTodo(newTodo);

      addTodo(newTodo)
        .then(response => {
          reducer({ type: ActionType.Add, payload: response });

          setTempTodo(null);
          setQuery('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');

          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        })
        .finally(() => {
          setIsDisabled(false);
          setTempTodo(null);
        });
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  const handleClearAll = () => {
    todos.forEach((todo => {
      if (todo.completed) {
        deleteTodo(todo.id)
          .then(() => {
            reducer({ type: ActionType.Delete, payload: todo.id });

            inputRef.current?.focus();
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');

            setTimeout(() => {
              setErrorMessage('');
            }, 3000);
          });
      }
    }));
  };

  const handleToggleAll = () => {
    const requiredValue = !todos.every(todo => todo.completed);

    todos.forEach((todo) => {
      if (todo.completed !== requiredValue) {
        updateTodo(todo.id, { completed: requiredValue, userId: 11562 })
          .then(() => {
            reducer({ type: ActionType.SetCompleted, payload: todo.id });
          })
          .catch(() => {
            setErrorMessage('Unable to update a todo');

            setTimeout(() => {
              setErrorMessage('');
            }, 3000);
          });
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: todos
                    .filter(todo => todo.completed)
                    .length === todos.length,
                },
              )}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={(event) => handleAddTodo(event)}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={isDisabled}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filteredTodos}
            setErrorMessage={setErrorMessage}
            focusMainInput={() => inputRef.current?.focus()}
          />

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              setErrorMessage={setErrorMessage}
              loadingByDefault
              focusMainInput={() => inputRef.current?.focus()}
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            setFilter={setFilter}
            handleClearAll={handleClearAll}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
