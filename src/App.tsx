/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { useTodos } from './hooks/useTodo';

export const App: React.FC = () => {
  const {
    todos,
    visibleTodos,
    activeCount,
    hasCompleted,
    allCompleted,
    filter,
    setFilter,
    errorMessage,
    setErrorMessage,
    createTodo,
    tmpTodo,
    deleteTodo,
    loadingIds,
    clearCompleted,
    changeTodoStatus,
    toggleAll,
    changeTodoTitle,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allCompleted={allCompleted}
          onAdd={createTodo}
          onError={setErrorMessage}
          isDisabled={!!tmpTodo}
          todosCount={todos.length}
          toggleAll={toggleAll}
        />

        <TodoList
          todos={visibleTodos}
          currentTodo={tmpTodo}
          loadingIds={loadingIds}
          onDelete={deleteTodo}
          onChange={changeTodoStatus}
          onUpdate={changeTodoTitle}
        />

        {todos.length > 0 && (
          <Footer
            filter={filter}
            todosCount={activeCount}
            onFilterChange={setFilter}
            hasCompleted={hasCompleted}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
