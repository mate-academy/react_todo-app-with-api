/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { DispatchContext, StateContext } from './components/TodosContext';

const USER_ID = 56;

export const App: React.FC = () => {
  const { todos, errorMessage } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        dispatch({
          type: 'errorMessage',
          payload: '',
        });
      }, 3000);
    }
  }, [errorMessage, dispatch]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <Main />

        {todos.length > 0 && <Footer />}
      </div>

      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
};
