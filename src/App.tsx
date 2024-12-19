/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterOptions } from './types/FilterOptions';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const {
    todos,
    newTitle,
    tempTodo,
    errorMessage,
    isReceivingAnswer,
    loadingTodoIds,
    editedTodoId,
    setNewTitle,
    setEditedTodoId,
    handleAddTodo,
    handleTodoDelete,
    handleTodoUpdate,
    handleCompletedDelete,
    handleToggleAll,
    handleErrorMessage,
    handleErrorReset,
  } = useTodos();

  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.DEFAULT,
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTitle={newTitle}
          receivingAnswer={isReceivingAnswer}
          onAddTodo={handleAddTodo}
          onCheckForErrors={handleErrorMessage}
          setNewTitle={setNewTitle}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          tempTodo={tempTodo}
          todos={todos}
          loadingTodoIds={loadingTodoIds}
          filterOption={filterOption}
          editedTodoId={editedTodoId}
          onTodoDelete={handleTodoDelete}
          onTodoUpdate={handleTodoUpdate}
          onEditTodo={setEditedTodoId}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            currentFilter={filterOption}
            onFilterOptionChange={setFilterOption}
            onCompletedDelete={handleCompletedDelete}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onResetError={handleErrorReset}
      />
    </div>
  );
};
