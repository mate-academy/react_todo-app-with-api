import React from 'react';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Todos } from './components/Todos/Todos';
import { Filter } from './components/Filter/Filter';
import { useAppContext } from './context/useAppContext';

export const App: React.FC = () => {
  const {
    state: {
      todos,
      error,
      filter,
    },
    actions: {
      filterTodos,
      clearError,
    },
  } = useAppContext();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>

        <Header />

        <Todos />

        {!!todos?.length && (
          <Footer>
            <Filter
              selectedFilter={filter}
              onFilterChange={filterTodos}
            />
          </Footer>
        )}
      </div>

      {error && (
        <ErrorNotification
          message={error}
          onClose={clearError}
          key={error}
        />
      )}
    </div>
  );
};
