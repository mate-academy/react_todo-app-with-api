/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
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

  if (errorMessage) {
    setTimeout(() => {
      dispatch({
        type: 'errorMessage',
        payload: '',
      });
    }, 3000);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <Main />

        {/* Hide the footer if there are no todos */}
        {!todos.length ? null : <Footer />}
        {/* <Footer /> */}
      </div>

      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
};
