/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';
import { useErrorNotification } from './hooks/useErrorNotification';
import { useTodosFiltering } from './hooks/useTodosFiltering';
import { useTodos } from './hooks/useTodos';
import { USER_ID } from './api/todos';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { errorMessage, setErrorMessage, handleHideError } =
    useErrorNotification();

  const {
    todos,
    isLoading,
    isAdding,
    deletingIds,
    updatingIds,
    handleSubmit,
    handleDeleteTodo,
    handleToggleTodo,
    handleUpdateTitle,
    handleClearCompleted,
    handleToggleAll,
    allCompleted,
    tempTodo,
    newTodoTitle,
    setNewTodoTitle,
  } = useTodos({
    onErrorReported: setErrorMessage,
    inputRef,
  });

  const { filteredTodos, filter, setFilter, someCompleted, hasTodos } =
    useTodosFiltering(todos);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          isAllCompleted={allCompleted}
          newTodoTitle={newTodoTitle}
          inputRef={inputRef}
          onSubmit={handleSubmit}
          onSetNewTodoTitle={setNewTodoTitle}
          isAdding={isAdding}
          onToggleAll={handleToggleAll}
          isLoading={isLoading}
          hasTodos={hasTodos}
        />

        {hasTodos && (
          <TodoList
            filteredTodos={filteredTodos}
            isAdding={isAdding}
            isLoading={isLoading}
            tempTodo={tempTodo}
            deletingIds={deletingIds}
            onDeleteTodo={handleDeleteTodo}
            onToggleTodo={handleToggleTodo}
            onUpdateTitle={handleUpdateTitle}
            updatingIds={updatingIds}
          />
        )}

        {hasTodos && (
          <TodoFilter
            todos={todos}
            filter={filter}
            isAnyTodoCompleted={someCompleted}
            onSetFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHideError={handleHideError}
      />
    </div>
  );
};
