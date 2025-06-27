/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { useTodo } from './utils/hooks/useTodo';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const {
    errorMessage,
    setErrorMessage,
    isLoading,
    todos,
    filteredTodos,
    filterOption,
    setFilterOption,
    handleDeleteTodo,
    tempTodo,
    handleClearCompletedTodos,
    focusInput,
    setFocusInput,
    query,
    setQuery,
    handleSubmitForm,
    handleUpdateTodo,
    handleUpdateTodos,
    updatingTodosIds,
    handleTodoEditSubmit,
  } = useTodo();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isLoading={isLoading}
          todoDeleted={focusInput}
          query={query}
          setQuery={setQuery}
          handleSubmitForm={handleSubmitForm}
          handleUpdateTodos={handleUpdateTodos}
        />

        <TodoList
          tempTodo={tempTodo || null}
          isLoading={isLoading}
          handleDeleteTodo={handleDeleteTodo}
          handleTodoEditSubmit={handleTodoEditSubmit}
          handleUpdateTodo={handleUpdateTodo}
          updatingTodosIds={updatingTodosIds}
          filteredTodos={filteredTodos}
          todos={todos}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            handleClearCompletedTodos={handleClearCompletedTodos}
            setFocusInput={setFocusInput}
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
