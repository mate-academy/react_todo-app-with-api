/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-console */
import React from 'react';
import classNames from 'classnames';
import { USER_ID } from './api/todosMethods';
import { UserWarning } from './UserWarning';
import { useTodos } from './hooks/useTodos';
import { TodoList } from './components/TodoList';
import { Form } from './components/Form';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const {
    todos,
    errorMessage,
    filterStatus,
    setFilterStatus,
    loadingTodo,
    title,
    setTitle,
    allCompleted,
    someCompleted,
    activeCount,
    toggleAll,
    clearCompleted,
    isLoading,
    handleSubmit,
    inputRef,
    todosFiltered,
    tempTodo,
    toggleTodo,
    removeTodo,
    showError,
    updateTodoTitle,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && !isLoading && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}
          <Form
            loadingTodo={loadingTodo}
            inputRef={inputRef}
            setTitle={setTitle}
            title={title}
            handleSubmit={handleSubmit}
          />
        </header>

        <TodoList
          todosFiltered={todosFiltered}
          tempTodo={tempTodo}
          loadingTodo={loadingTodo}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
          updateTodoTitle={updateTodoTitle}
        />
        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            someCompleted={someCompleted}
            clearCompleted={clearCompleted}
          />
        )}
      </div>
      <ErrorNotification
        error={errorMessage}
        onClearError={() => showError(null)}
      />
    </div>
  );
};
