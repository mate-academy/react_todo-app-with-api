/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { TodoManager } from './utils/TodoManager';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { AddTodoForm } from './components/AddTodoForm';
import { ErrorModal } from './components/ErrorModal';
import { Errors } from './types/Errors';
import { Loader } from './components/Loader';
import './styles/index.scss';

export const App: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const {
    errorMessage,
    filterBy,
    handleAddTodo,
    handleClearCompleted,
    handleDeleteTodo,
    handleToggleAllTodos,
    handleUpdateTodo,
    isAdding,
    isClearingCompleted,
    isDeleting,
    isToggling,
    loading,
    onToggleTodo,
    setErrorMessage,
    setFilterBy,
    tempTodo,
    todos,
    todosToDisplay,
  } = TodoManager();

  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <div className="todoapp__title">todo</div>

      {/* Header */}

      <Header
        handleToggle={handleToggleAllTodos}
        areAllCompleted={areAllCompleted}
      />

      {/* Add Todo Form */}
      <AddTodoForm
        newTodoTitle={newTodoTitle}
        setNewTodoTitle={setNewTodoTitle}
        handleAddTodo={handleAddTodo}
        isAdding={isAdding}
      />

      {/* Main Content */}
      <section className="todoapp__main">
        {loading || isAdding ? (
          <Loader message="Loading your todos..." />
        ) : (
          <TodoList
            todos={todosToDisplay}
            deleteTodo={handleDeleteTodo}
            updateTodo={handleUpdateTodo}
            toggleTodo={onToggleTodo}
            isDeleting={isDeleting}
            isToggling={isToggling}
          />
        )}
      </section>

      {/* Footer */}
      <Footer
        todos={todos}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        onClearCompleted={handleClearCompleted}
        isClearingCompleted={isClearingCompleted}
      />

      {/* Temporary Todo */}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onToggle={() => Promise.resolve()} // Temp todos can't be toggled
          deleteTodo={handleDeleteTodo}
          updateTodo={() => Promise.resolve()} // No updates for temp todos
          isDeleting={false}
          loading={true}
        />
      )}

      {/* Error Modal */}
      {errorMessage !== Errors.DEFAULT && (
        <ErrorModal
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage(Errors.DEFAULT)}
        />
      )}
    </div>
  );
};
