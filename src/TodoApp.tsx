/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';

import { TodoList } from './components/TodoList/TodoList';
import { USER_ID, getTodos } from './api/todos';
import { UserWarning } from './UserWarning';
import { Footer } from './components/footer/Footer';
import { CustomError } from './components/error/CustomError';
import { MyContext, MyContextData } from './components/context/myContext';
import { CustomHeader } from './components/header/CustomHeader';

export const TodoApp: React.FC = () => {
  const { reducer, fitlerType, handleSetError } = useContext(
    MyContext,
  ) as MyContextData;
  const { filterItems, state, fetchData } = reducer;

  const hasItems = state.length > 0;

  useEffect(() => {
    getTodos()
      .then(dataFromServer => {
        fetchData(dataFromServer);
      })
      .catch(() => handleSetError('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <CustomHeader />
        {hasItems && (
          <>
            <TodoList data={filterItems(fitlerType)} />

            <Footer filterType={fitlerType} />
          </>
        )}
      </div>
      <CustomError />
    </div>
  );
};
