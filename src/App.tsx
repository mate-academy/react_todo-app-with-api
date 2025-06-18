/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { UserWarning } from './UserWarning';

import * as todoServices from './api/todos';
import { FilterStatus } from './utils/FilterStatus';

import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './utils/ErrorMessage';
import { useTodo } from './hooks/useTodos';

export const App: React.FC = () => {
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  const {
    // state
    todos,
    isLoading,
    newTodoTitle,
    setNewTodoTitle,
    tempTodo,
    errorMessage,
    setErrorMessage,
    editingTodoId,
    editingTitle,
    setEditingTitle,
    processingTodoIds,

    // values
    isAddingTodo,
    activeTodosCount,
    showFooter,
    isProcessingAnyTodo,
    everyTodosCompleted,

    // functions
    handleAddTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleUpdateTodo,
    handleToggleAllTodos,
    handleStartEditing,
    handleCancelEdit,
    handleSaveEdit,
  } = useTodo();

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      case FilterStatus.All:
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={handleAddTodo}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isAddingTodo={isAddingTodo}
          isProcessingAnyTodo={isProcessingAnyTodo}
          everyTodosCompleted={everyTodosCompleted}
          onToggleAllTodos={handleToggleAllTodos}
          isTogglingAllTodos={isProcessingAnyTodo}
          hasTodos={todos.length > 0}
          isLoading={isLoading}
        />
        <TodoList
          todos={visibleTodos}
          onDeleteTodo={handleDeleteTodo}
          onToggleTodo={handleUpdateTodo}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          onStartEdit={handleStartEditing}
          onCancelEdit={handleCancelEdit}
          onSaveEdit={handleSaveEdit}
          setEditingTitle={setEditingTitle}
          processingTodoIds={processingTodoIds}
        />

        {isAddingTodo && tempTodo && (
          <TodoItem
            key="temp-todo-loader"
            todo={tempTodo}
            isTemp={true}
            processingWithTodos={true}
          />
        )}

        {showFooter && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
            totalTodos={todos.length}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.DEFAULT_ERROR)}
      />
    </div>
  );
};
