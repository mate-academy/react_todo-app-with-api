/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  addTodo,
  deleteTodo,
  getTodos,
  upgradeTodo,
} from './api/todos';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { filterTodos } from './utils/filterTodos';
import { Footer } from './components/Footer';
import { FilterBy } from './types/FilterBy';

const USER_ID = 6408;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.all);
  const [isError, setIsError] = useState(false);
  const [typeError, setTypeError] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [tempTodos, setTempTodos] = useState<Todo[]>([]);
  const [isAllStatusCompleted, setisAllStatusCompleted] = useState(false);

  const pushError = (message: string) => {
    setIsError(true);
    setTypeError(message);
    window.setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  const completedTodos = todos.filter(t => t.completed);
  const countTodos = todos.length - completedTodos.length;

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(6408);

      setTodos(todosFromServer);
    } catch {
      pushError('upload');
    }
  };

  const addTodosOnServer = async () => {
    setIsDisabled(true);
    try {
      const todo = {
        id: 0,
        title: query,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(todo);

      await addTodo(USER_ID, query);
      await getTodosFromServer();
      setisAllStatusCompleted(false);
      setQuery('');
      setTempTodo(null);
    } catch {
      pushError('add');
      setQuery('');
    } finally {
      setIsDisabled(false);
    }
  };

  const deleteTodoFromServer = async (id: number) => {
    try {
      const selectTodo = todos.find(t => t.id === id);

      if (selectTodo) {
        setTempTodos((prev) => ([...prev,
          selectTodo]));
      }

      await deleteTodo(id);
      await getTodosFromServer();
      setisAllStatusCompleted(false);
    } catch {
      pushError('delete');
    } finally {
      setTempTodos([]);
    }
  };

  const upgradeTodoFromServer = async (todo: Todo) => {
    try {
      setTempTodos((prev) => ([...prev, todo]));
      await upgradeTodo(todo);

      await getTodosFromServer();
      setisAllStatusCompleted(false);
    } catch {
      pushError('update');
    } finally {
      setTempTodos([]);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const visibleData = filterTodos(todos, filterBy);

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      return pushError('Title can\'t be empty');
    }

    return addTodosOnServer();
  };

  const removeAllComplited = () => {
    completedTodos.map(t => deleteTodoFromServer(t.id));
  };

  const removeTodo = (id: number) => {
    deleteTodoFromServer(id);
  };

  const handlerStatus = (todo: Todo) => {
    const updateTodo = {
      ...todo,
      completed: !todo.completed,
    };

    upgradeTodoFromServer(updateTodo);
  };

  const handlerAllStatus = (status: boolean) => {
    if (!status) {
      setisAllStatusCompleted(true);
      const noCompletedTodos = todos.filter(todo => !todo.completed);

      return noCompletedTodos.map(todo => handlerStatus(todo));
    }

    setisAllStatusCompleted(false);

    return todos.map(todo => handlerStatus(todo));
  };

  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {!!todos.length && (
            <button
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: todos.every(todo => todo.completed) },
              )}
              onClick={() => {
                handlerAllStatus(isAllStatusCompleted);
              }}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={(event) => handlerSubmit(event)}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={((event) => setQuery(event.target.value))}
              disabled={isDisabled}
              ref={ref}

            />
          </form>
        </header>
        <TodoList
          todos={visibleData}
          tempTodo={tempTodo}
          tempTodos={tempTodos}
          removeTodo={removeTodo}
          handlerStatus={handlerStatus}
          upgradeTodoFromServer={upgradeTodoFromServer}
          deleteTodoFromServer={deleteTodoFromServer}
        />
        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            countTodos={countTodos}
            isCompleted={!!completedTodos.length}
            removeAllComplited={removeAllComplited}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification
        setIsError={setIsError}
        typeError={typeError}
        isError={isError}
      />
    </div>
  );
};
