/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Footer } from './components/Footer/Footer';
import { Errors } from './components/Errors/Errors';
import { IsActiveLink } from './types/types';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { loadTodos } from './app/features/todosSlice';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, hasError } = useAppSelector(state => state.todos);

  const [link, setLink] = useState(IsActiveLink.All);

  useEffect(() => {
    dispatch(loadTodos());
  }, []);

  const visibleTodos = React.useMemo(() => {
    if (link === IsActiveLink.Active) {
      return todos.filter(t => !t.completed);
    }

    if (link === IsActiveLink.Completed) {
      return todos.filter(t => t.completed);
    }

    return todos;
  }, [link, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <Main filteredTodos={visibleTodos} />

        <Footer link={link} setLink={setLink} />
      </div>

      <Errors hasError={hasError} />
    </div>
  );
};
