import React from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { useTodosManager } from './hooks/useTodosManager';

import { NewTodoForm, ToggleAllButton } from './components/Header';
import {
  ClearCompletedButton,
  TodosCounter,
  TodosFilter,
} from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const {
    todos,
    loading,
    errorMessage,
    filter,
    tempTodo,
    loadingIds,
    allCompleted,
    activeTodosCount,
    completedTodosCount,
    filteredTodos,
    inputRef,
    setFilter,
    setErrorMessage,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleToggleAll,
    handleUpdateTodoTitle,
    setShouldFocus,
    newTodoTitle,
    setNewTodoTitle,
  } = useTodosManager();

  const isClearCompletedDisabled = loading || completedTodosCount === 0;

  const isToggleAllDisabled = loading || todos.length === 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <ToggleAllButton
              allCompleted={allCompleted}
              onToggleAll={handleToggleAll}
              isDisabled={isToggleAllDisabled}
            />
          )}
          <NewTodoForm
            onAddTodo={handleAddTodo}
            isDisabled={tempTodo !== null}
            inputRef={inputRef}
            value={newTodoTitle}
            onChange={setNewTodoTitle}
          />
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            loadingIds={loadingIds}
            onUpdateTitle={handleUpdateTodoTitle}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <TodosCounter count={activeTodosCount} />

            <TodosFilter filter={filter} onFilterChange={setFilter} />

            <ClearCompletedButton
              onClearCompleted={handleClearCompleted}
              isDisabled={isClearCompletedDisabled}
            />
          </footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => {
          setErrorMessage('');
          setShouldFocus(true);
        }}
      />
    </div>
  );
};
