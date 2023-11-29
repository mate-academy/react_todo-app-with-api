import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './redux/store';
import { fetchTodos } from './redux/todoThunks';
import { USER_ID } from './_utils/constants';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { UserWarning } from './components/UserWarning/UserWarning';

export const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTodos(USER_ID));
  }, [dispatch]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoHeader />

        <TodoList />

        <TodoFooter />

      </div>

      <ErrorNotification />

    </div>
  );
};
