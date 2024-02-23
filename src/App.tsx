/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import cn from 'classnames';
import { Header } from './Components/Header/Header';
import { Section } from './Components/Section/Section';
import { TodosContext } from './Components/Store/Store';
import { Footer } from './Components/Footer/Footer';

export const App: React.FC = () => {
  const {
    todos, errorMessage, setErrorMessage, creating,
  } = useContext(TodosContext);

  return (
    <div className={cn('todoapp', { 'has-error': true })}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <Section />
        {(todos.length > 0 || creating) && <Footer />}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
          disabled={!errorMessage}
          style={errorMessage ? { cursor: 'pointer' } : { cursor: 'default' }}
        />
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    </div>
  );
};
