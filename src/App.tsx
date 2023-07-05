import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import { deleteTodo, getTodos } from './api/todos';
import { Filter } from './types/types';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';

const USER_ID = 10917;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);

  const [filter, setFilter] = useState<string | null>('');
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [formLoader, setFormLoader] = useState<boolean>(false);
  const [todosLoader, setTodosLoader] = useState<boolean>(false);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTodos(USER_ID);

        setVisibleTodos(response as Todo[]);
        setTodos(response as Todo[]);
      } catch (error) {
        throw new Error('Data not found');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setVisibleTodos(todos.filter((todo) => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    }));
  }, [filter, todos]);

  const handleClearCompleted = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);
      const deletedTodos = completedTodos
        .map(todo => deleteTodo(todo.id, setTodos, setErrorMessage));

      setIsLoadingCompleted(true);
      await Promise.all(deletedTodos);
      setVisibleTodos(todos.filter(todo => !todo.completed));
      setIsLoadingCompleted(false);
    } catch (error) {
      setErrorMessage('Unable to delete completed todos');
      throw new Error('Error');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoForm
            todos={todos}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            formLoader={formLoader}
            setFormLoader={setFormLoader}
            setTodosLoader={setTodosLoader}
            setTempTodo={setTempTodo}
          />
        </header>

        <section className="todoapp__main">

          <div>
            <TodoList
              visibleTodos={visibleTodos}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              todosLoader={todosLoader}
              isLoadingCompleted={isLoadingCompleted}
            />
            {(formLoader && tempTodo) && (
              <div className="todo">
                <div className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
                <label className="todo__status-label">
                  <input
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                <span className="todo__title">{tempTodo?.title}</span>
                <button type="button" className="todo__remove">×</button>

                <div className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </div>
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>
            <nav className="filter">
              <a
                href="#/"
                className={classNames(
                  'filter__link',
                  { selected: filter === '' },
                )}
                onClick={() => setFilter('')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link',
                  { selected: filter === 'Active' },
                )}
                onClick={() => setFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link',
                  { selected: filter === 'Completed' },
                )}
                onClick={() => setFilter('Completed')}
              >
                Completed
              </a>
            </nav>

            {todos.filter(todo => todo.completed).length !== 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>
      {errorMessage && (
        <div
          className="
          notification
          is-danger
          is-light
          has-text-weight-normal"
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          <br />
          {errorMessage}
          <br />
        </div>
      )}
    </div>
  );
};
