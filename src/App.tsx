/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TEMP_TODO_ID, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { useTodoController } from './hooks/useTodoController';

export const App: React.FC = () => {
  const {
    isThereAlLeastOneTodo,
    isInitialLoading,
    errorMessage,
    setErrorMessage,
    tempTodo,
    isTodoLoading,
    isAlLeastOneTodoLoading,
    isAllTodosCompleted,
    onAddTodo,
    inputFocusRef,
    onTodoDelete,
    onClearCompletedTodos,
    onTodoUpdate,
    onToggleTodos,
    statusFilter,
    setStatusFilter,
    filteredTodos,
    activeTodosCount,
    isThereAtLeastOneCompletedTodo,
  } = useTodoController();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoading={isTodoLoading(TEMP_TODO_ID)}
          isThereAlLeastOneTodo={isThereAlLeastOneTodo}
          onAddTodo={onAddTodo}
          isAlLeastOneTodoLoading={isAlLeastOneTodoLoading}
          isAllTodosCompleted={isAllTodosCompleted}
          onToggleTodos={onToggleTodos}
          ref={inputFocusRef}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          isTodoLoading={isTodoLoading}
          onTodoDelete={onTodoDelete}
          onTodoUpdate={onTodoUpdate}
        />

        {!isInitialLoading && isThereAlLeastOneTodo && (
          <Footer
            activeTodosCount={activeTodosCount}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            isThereAtLeastOneCompletedTodo={isThereAtLeastOneCompletedTodo}
            onClearCompletedTodos={onClearCompletedTodos}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
