/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';

import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotificaton';

import { FilterStatus } from './types/types';
import { USER_ID } from './api/todos';

import { useErrorMessage } from './hooks/useErrorMessage';
import { useTodos } from './hooks/useTodos';
import { getVisibleTodos } from './utils/todoUtils';

export const App: React.FC = () => {
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [error, setError] = useErrorMessage();

  const {
    todos,
    tempTodo,
    deletingId,
    loadingId,
    addTodo,
    removeTodo,
    renameTodo,
    clearCompleted,
    toggleAll,
    toggleTodo,
    isAllCompleted,
  } = useTodos(setError);

  const visibleTodos = getVisibleTodos(todos, filter);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={addTodo}
          onError={setError}
          loading={!!tempTodo || deletingId.length > 0}
          isAllCompleted={isAllCompleted}
          onToggleAll={toggleAll}
          hasTodos={todos.length > 0}
        />

        {(!!todos.length || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            onToggle={toggleTodo}
            tempTodo={tempTodo}
            deletingId={deletingId}
            loadingId={loadingId}
            onDelete={removeTodo}
            onRename={renameTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onErrorClose={() => setError(null)} />
    </div>
  );
};
