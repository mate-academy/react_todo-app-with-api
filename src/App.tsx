/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Todolist } from './components/Todolist/Todolist';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';
import { Errors } from './types/Error';

const USER_ID = 11843;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(Filter.all);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState(Filter.all);
  const [temptodo, setTempTodo] = useState<Todo | null>(null);
  const [cleared, setcleared] = useState<boolean>(false);
  const [toggled, setToggled] = useState<string>('');
  const titleField = useRef<HTMLInputElement | null>(null);

  const clickHandler = (value: Filter) => {
    switch (value) {
      case Filter.active:
        setFilterBy(Filter.active);
        setActiveFilter(Filter.active);
        break;
      case Filter.completed:
        setFilterBy(Filter.completed);
        setActiveFilter(Filter.completed);
        break;
      default:
        setFilterBy(Filter.all);
        setActiveFilter(Filter.all);
        break;
    }
  };

  useEffect(() => {
    getTodos(USER_ID).catch().then(setTodos)
      .catch(() => setError(Errors.unableLoad));
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const displayfiltered = () => {
    let filteredTodos = [...todos];

    switch (filterBy) {
      case Filter.active:
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        break;
      case Filter.completed:
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    return filteredTodos;
  };

  const displayTodos = [...displayfiltered()];

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodos={setTodos}
          todos={todos}
          setError={setError}
          setTempTodo={setTempTodo}
          temptodo={temptodo}
          setToggled={setToggled}
          titleField={titleField}
        />

        <Todolist
          displayTodos={displayTodos}
          temptodo={temptodo}
          setTodos={setTodos}
          todos={todos}
          setError={setError}
          cleared={cleared}
          toggled={toggled}
          titleField={titleField}
        />

        {todos.length !== 0
          && (
            <Footer
              clickHandler={clickHandler}
              activeFilter={activeFilter}
              displayTodos={todos}
              setcleared={setcleared}
              setTodos={setTodos}
              todos={todos}
              setError={setError}
              titleField={titleField}
            />
          )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn('notification', 'is-danger', 'is-light', 'has-text-weight-normal', { hidden: !error })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error && (`${error}`)}
      </div>
    </div>
  );
};
