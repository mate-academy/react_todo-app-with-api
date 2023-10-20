/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Filter } from './types/Todo';
import { Header } from './components/Header/Header';
import { List } from './components/List/List';
import { Footer } from './components/Footer/Footer';
import { useTodos } from './useTodos';

export const App: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('All');
  const {
    todos,
    errorMessage,
    isLoading,
    tempTodo,
    handleSubmit,
    handleDelete,
    handleToggle,
    handleToggleButton,
    title,
    setTitle,
    setErrorMessage,
    handleClearCompleted,
    handleEdit,
    editTodo,
    setEditTodo,
    activeTodosId,
  } = useTodos(USER_ID);

  const counter = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  const visibleTodos = () => {
    const visible = [...todos].filter(todo => {
      if (filter === 'Active' && todo.completed) {
        return false;
      }

      if (filter === 'Completed' && !todo.completed) {
        return false;
      }

      return true;
    });

    return visible;
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          todos={todos}
          isLoading={isLoading}
          handleToggleButton={handleToggleButton}
        />
        {todos.length > 0
        && (
          <List
            todos={visibleTodos()}
            tempTodo={tempTodo}
            handleDelete={handleDelete}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            editTodo={editTodo}
            setEditTodo={setEditTodo}
            activeTodosId={activeTodosId}
          />
        )}
        {todos.length > 0 && (
          <Footer
            counter={counter()}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
            todos={visibleTodos()}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          !errorMessage && 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
        <br />
        {/* Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
