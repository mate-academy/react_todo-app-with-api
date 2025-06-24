import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { ErrorMessages } from './components/Error/ErrorMessages';
import React from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';

export const App: React.FC = () => {
  const {
    errorMessage,
    setErrorMessage,
    statusFilter,
    setStatusFilter,
    handleHideError,
    hasTodos,
    filteredTodos,
    activeTodos,
    handleTodoDelete,
    handleDeleteAllCompletedTodos,
    allTodosCompleted,
    isCompletedTodos,
    handleTodoAdd,
    tempTodo,
    setTempTodo,
    inputFocus,
    todoInOperation,
    handleUseToggle,
    handleTodoStatusToggle,
    handleTodoTitleUpdate,
    isLoading,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          allTodosCompleted={allTodosCompleted}
          handleTodoAdd={handleTodoAdd}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          inputFocus={inputFocus}
          onToggle={handleUseToggle}
          isLoading={isLoading}
          hasTodos={hasTodos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          handleTodoDelete={handleTodoDelete}
          tempTodo={tempTodo}
          todoInOperation={todoInOperation}
          handleTodoStatusToggle={handleTodoStatusToggle}
          handleTodoTitleUpdate={handleTodoTitleUpdate}
        />
        {hasTodos && (
          <Footer
            activeTodos={activeTodos}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            isCompletedTodos={isCompletedTodos}
            handleDeleteAllCompletedTodos={handleDeleteAllCompletedTodos}
          />
        )}
      </div>
      <ErrorMessages
        errorMessage={errorMessage}
        onHideError={handleHideError}
      />
    </div>
  );
};
