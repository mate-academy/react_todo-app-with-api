import React, { useContext, useEffect } from 'react';
import {
  TodoContext, TodoUpdateContext,
} from './components/TodoContext';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterProvider } from './components/FilterContext';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { VisibleTodos } from './components/VisibleTodos';

export const App: React.FC = () => {
  const { todos, error } = useContext(TodoContext);
  const { closeErrorMessage } = useContext(TodoUpdateContext);

  // when data trigger error, the message will be auto removed in 3 sec
  useEffect(() => {
    setTimeout(() => closeErrorMessage, 3000);
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {!!todos.length
          && (
            <FilterProvider>
              <section className="todoapp__main" data-cy="TodoList">
                <VisibleTodos />
              </section>

              <Footer />
            </FilterProvider>
          )}
      </div>

      <ErrorNotification />
    </div>
  );
};
