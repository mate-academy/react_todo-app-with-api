import React, { useContext } from 'react';
import { TodoContext } from './components/ContextProviders/TodoProvider';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { VisibleTodos } from './components/VisibleTodos';

export const App: React.FC = () => {
  const { todos } = useContext(TodoContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {!!todos.length
          && (
            <>
              <section className="todoapp__main" data-cy="TodoList">
                <VisibleTodos />
              </section>

              <Footer />
            </>
          )}
      </div>

      <ErrorNotification />
    </div>
  );
};
