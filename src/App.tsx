/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useContext,
  useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import './App.css';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  addTodo, deleteTodo, getTodos, toggleTodo,
} from './api/todos';

import { ErrorMessages } from './components/ErrorMessages/ErrorMessages';
import { TodoList } from './components/TodoList/TodoList';
import { TodoOnAdd } from './components/TodoOnAdd/TodoOnAdd';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState('all');
  const [isError, setIsError] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isTogglingAll, setIsTogglingAll] = useState(false);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then((response) => {
          setTodos(response);
          setTodos(response);
        })
        .catch(() => {
          setIsError('load');
        });
    }
  }, []);

  const onAddNewTodo = async () => {
    setIsAdding(true);

    if (!newTodo.trim().length) {
      setIsError('length');
      setIsAdding(false);
      setNewTodo('');

      return;
    }

    if (user) {
      try {
        const newTodoFromAPI = await addTodo(newTodo, user.id);

        setTodos(prevState => [...prevState, newTodoFromAPI]);
      } catch {
        setIsError('add');
      }
    }

    setNewTodo('');
    setIsAdding(false);
  };

  const onDeleteAllCompleted = async () => {
    setIsDeletingAll(true);

    try {
      await Promise.all(todos.map(todoItem => {
        if (todoItem.completed) {
          return deleteTodo(todoItem.id);
        }

        return null;
      }));

      setTodos(prevState => (
        prevState.filter(todoItem => !todoItem.completed)
      ));
    } catch (e) {
      setIsError('deleteAll');
    }

    setIsDeletingAll(false);
  };

  const onUpdateAll = async () => {
    // If all todos are completed switch 'em all to NOT completed:
    if (todos.every(item => item.completed)) {
      setIsDeletingAll(true);

      try {
        await Promise.all(todos.map(todoItem => {
          return toggleTodo(todoItem);
        }));

        setTodos(prevState => (
          prevState.map(todoItem => ({
            ...todoItem,
            completed: !todoItem.completed,
          }))
        ));
      } catch (e) {
        setIsError('updateAll');
      }

    // If some of todos are NOT completed switch 'em to completed:
    } else {
      setIsTogglingAll(true);

      try {
        await Promise.all(todos.map(todoItem => {
          if (!todoItem.completed) {
            return toggleTodo(todoItem);
          }

          return null;
        }));

        setTodos(prevState => (
          prevState.map(todoItem => {
            if (!todoItem.completed) {
              return {
                ...todoItem,
                completed: !todoItem.completed,
              };
            }

            return todoItem;
          })
        ));
      } catch (e) {
        setIsError('updateAll');
      }
    }

    setIsDeletingAll(false);
    setIsTogglingAll(false);
  };

  const filterTodos = useCallback(() => {
    if (filterBy === 'completed') {
      return todos.filter(todoFilter => todoFilter.completed);
    }

    if (filterBy === 'active') {
      return todos.filter(todoFilter => !todoFilter.completed);
    }

    return todos;
  }, [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(item => item.completed),
              })}
              onClick={onUpdateAll}
            />
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();

              onAddNewTodo();
            }}
          >
            <input
              disabled={isAdding}
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
          </form>
        </header>

        <TransitionGroup>
          <CSSTransition
            timeout={300}
            classNames="list-item"
          >
            <TodoList
              setError={setIsError}
              setVisibleTodos={setTodos}
              todos={filterTodos()}
              isDeletingAll={isDeletingAll}
              isTogglingAll={isTogglingAll}
            />
          </CSSTransition>

          {isAdding && (
            <CSSTransition
              timeout={300}
              classNames="temp-item"
            >
              <TodoOnAdd title={newTodo} />
            </CSSTransition>
          )}
        </TransitionGroup>

        {(todos.length > 0 || isAdding) && (
          <>
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {todos
                  .filter(task => (
                    !task.completed)).length}
                {' items left'}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames('filter__link', {
                    selected: filterBy === 'all',
                  })}
                  onClick={() => setFilterBy('all')}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: filterBy === 'active',
                  })}
                  onClick={() => setFilterBy('active')}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: filterBy === 'completed',
                  })}
                  onClick={() => setFilterBy('completed')}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                disabled={!todos.some(
                  todoItem => (
                    todoItem.completed
                  ),
                )}
                onClick={(event) => {
                  event.preventDefault();

                  onDeleteAllCompleted();
                }}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {isError && (
        <ErrorMessages
          setError={setIsError}
          error={isError}
          onClose={() => setIsError('')}
        />
      )}
    </div>
  );
};
