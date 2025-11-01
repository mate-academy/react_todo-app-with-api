/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import Footer from './components/Footer';
import ErrorNotification from './components/ErrorNotification';
import Header from './components/Header';
import useTodoData from './hooks/useTodoData';
import useTodoFilters from './hooks/useTodoFilters';
import useErrors from './hooks/useErrors';

export const App: React.FC = () => {
  const { errorMessage, showError, hideError } = useErrors();

  const {
    todos,
    tempTodo,
    handleSubmit,
    handleDelete,
    handleEditTodo,
    handleToggleAllComplete,
    handleDeleteAllCompleted,
    getIsTodoLoading,
  } = useTodoData(showError);

  const { status, filteredTodos, todosLeft, handleStatusChange } =
    useTodoFilters(todos);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const hasCompletedTodos = todos.some(todo => todo.completed);
  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          allTodosCompleted={allTodosCompleted}
          tempTodo={tempTodo}
          onSubmit={handleSubmit}
          onToggleAllComplete={handleToggleAllComplete}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={handleDelete}
          isLoading={getIsTodoLoading}
          onEditTodo={handleEditTodo}
        />

        {todos.length > 0 && (
          <Footer
            status={status}
            todosLeft={todosLeft}
            hasCompletedTodos={hasCompletedTodos}
            onDeleteAll={handleDeleteAllCompleted}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <ErrorNotification errorMsg={errorMessage} onHideError={hideError} />
    </div>
  );
};
