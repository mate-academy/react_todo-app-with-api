/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotifications } from './components/ErrorNotifications';
import {
  handleErrorNotification,
  loadTodosFromServer,
} from './features/todosSlice';
import { useAppDispatch } from './app/hooks';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    dispatch(loadTodosFromServer());
    setTimeout(() => dispatch(handleErrorNotification('')), 3000);
  }, [dispatch]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <TodoList />
        <Footer />
      </div>
      <ErrorNotifications />
    </div>
  );
};
