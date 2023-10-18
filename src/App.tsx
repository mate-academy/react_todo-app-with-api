/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import { AppContext, AppContextType } from './Contexts/AppContextProvider';
import { TodoAddForm } from './components/TodoAddForm';
import { ToggleTodoButton } from './components/ToggleTodoButton';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorBanner } from './components/ErrorBanner';

export const App: React.FC = () => {
  const {
    todos,
    errorMessage,
    setErrorMessage,
    inputRef,
  } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    if (errorMessage !== 'Unable to update a todo' && errorMessage) {
      inputRef.current?.focus();
    }
  }, [inputRef, todos, errorMessage]);

  useEffect(() => {
    if (errorMessage) {
      window.setTimeout(() => {
        setErrorMessage('');
      }, 3100);
    }
  }, [errorMessage, setErrorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && <ToggleTodoButton />}

          <TodoAddForm />
        </header>

        {!!todos.length && (
          <>
            <TodoList />

            <Footer />
          </>
        )}
      </div>

      <ErrorBanner />
    </div>
  );
};
