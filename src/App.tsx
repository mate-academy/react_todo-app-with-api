/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import classNames from 'classnames';
import { ErrorNotification } from './compontents/ErrorNotification';
import { TodoList } from './compontents/TodoList';
import { Errors } from './types/Errors';
import { Footer } from './compontents/Footer';
import { useTodoControl } from './hooks/useTodoControl';

export const App: React.FC = () => {
  const {
    isShowHeaderAndFooter,
    handleMassiveEditStatus,
    isAllCompleted,
    handleSubmit,
    newTitle,
    setNewTitle,
    filteredTodos,
    processingIds,
    tempTodo,
    newTodoTitleRef,
    handleDeleteTodo,
    errorMessage,
    setErrorMessage,
    isDisabled,
    handleMassiveDelete,
    filterBy,
    activeTodosLength,
    setFilterBy,
    handleEditTodo,
  } = useTodoControl();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {isShowHeaderAndFooter && (
            <button
              type="button"
              onClick={handleMassiveEditStatus}
              className={classNames('todoapp__toggle-all', {
                active: isAllCompleted,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              autoFocus
              ref={newTodoTitleRef}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          waitingTodos={processingIds}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          onUpdate={handleEditTodo}
        />

        {/* Hide the footer if there are no todos */}
        {isShowHeaderAndFooter && (
          <Footer
            filterBy={filterBy}
            activeTodosLength={activeTodosLength}
            onFilterChange={setFilterBy}
            isDisabled={isDisabled}
            onMassiveDelete={handleMassiveDelete}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      <ErrorNotification
        errorMessage={errorMessage}
        resetError={() => setErrorMessage(Errors.Default)}
      />
    </div>
  );
};
