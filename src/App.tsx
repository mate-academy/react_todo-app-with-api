/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useState,
} from 'react';
import classNames from 'classnames';
import {
  StateContext,
} from './components/TodoContext';
import { TodoList } from './components/TodoList';
import {
  FILTER,
  ACTIONS,
  USER_ID,
} from './utils/enums';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const { state, dispatch } = useContext(StateContext);
  const [newTodo, setNewTodo] = useState<null | Todo>(null);

  function deleteAll() {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    state.list.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id)
          .then(() => getTodos(USER_ID)
            .then(res => {
              dispatch({ type: ACTIONS.SET_LIST, payload: res });
            }))
          .finally(() => dispatch(
            { type: ACTIONS.SET_LOADING, payload: false },
          ));
      }
    });
  }

  function handleFilter(trigger: string) {
    dispatch({ type: ACTIONS.SORT, payload: trigger });
  }

  const initialTodo = {
    id: 0,
    title: query,
    userId: USER_ID,
    completed: false,
  };

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.code === 'Enter') {
      e.preventDefault();
      if (e.target.value.trim()) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        setNewTodo(initialTodo);
        addTodo(initialTodo)
          .then(() => getTodos(USER_ID)
            .then(res => {
              dispatch({ type: ACTIONS.SET_LIST, payload: res });
              dispatch({ type: ACTIONS.SET_LOADING, payload: false });
              setNewTodo(null);
            }));
        setQuery('');
      }
    }
  }

  function toggleAll() {
    if (state.list.some(todo => !todo.completed)) {
      dispatch({ type: ACTIONS.TOGGLE_ALL, payload: 'active' });
      state.list.forEach(todo => {
        if (!todo.completed) {
          updateTodo({
            ...todo,
            completed: true,
          })
            .then(() => {
              getTodos(USER_ID)
                .then(res => {
                  dispatch({ type: ACTIONS.SET_LIST, payload: res });
                  dispatch({ type: ACTIONS.TOGGLE_ALL, payload: '' });
                });
            });
        }
      });
    }

    if (state.list.every(todo => todo.completed)) {
      dispatch({ type: ACTIONS.TOGGLE_ALL, payload: 'completed' });
      state.list.forEach(todo => updateTodo({
        ...todo,
        completed: false,
      })
        .then(() => {
          getTodos(USER_ID)
            .then(res => {
              dispatch({ type: ACTIONS.SET_LIST, payload: res });
              dispatch({ type: ACTIONS.TOGGLE_ALL, payload: '' });
            });
        }));
    }
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            onClick={toggleAll}
          />

          <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleEnter}
            />
          </form>
        </header>

        <TodoList list={state.list} newTodo={newTodo} />

        {(state.list.length > 0
          || newTodo || state.sortBy === FILTER.COMPLETED
          || newTodo || state.sortBy === FILTER.ACTIVE) && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {state.totalLength}
              &nbsp;items left
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: state.sortBy === FILTER.ALL,
                })}
                onClick={() => handleFilter(FILTER.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: state.sortBy === FILTER.ACTIVE,
                })}
                onClick={() => handleFilter(FILTER.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: state.sortBy === FILTER.COMPLETED,
                })}
                onClick={() => handleFilter(FILTER.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={deleteAll}
              style={{
                visibility: (
                  state.list.some(todo => todo.completed)
                ) ? 'visible' : 'hidden',
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {(state.error.length > 0) && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button type="button" className="delete" />
          {state.error}
        </div>
      )}
    </div>
  );
};
