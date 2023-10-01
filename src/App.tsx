/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { Filter } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorBin } from './components/ErrorBin/ErrorBin';
import { useTodos } from './hooks/useTodos';

const USER_ID = 11572;

export const App: React.FC = () => {
  const {
    todos,
    tempTodo,
    setNewTodoTitle,
    handleToggleAll,
    handleNewTodoSubmit,
    handleFormSubmitEdited,
    handleClearCompleted,
    handleCompletedStatus,
    handleDelete,
    setEditTodo,
    setErrorMessage,
    errorMessage,
    editTodo,
    newTodoTitle,
    isLoadingArr,
  } = useTodos(USER_ID);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const displayedTodos = () => {
    let filteredTodos = [...todos];

    filteredTodos = filteredTodos.filter(todo => {
      if (filter === 'Active' && todo.completed) {
        return false;
      }

      if (filter === 'Completed' && !todo.completed) {
        return false;
      }

      return true;
    });

    return filteredTodos;
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleToggleAll={handleToggleAll}
          handleNewTodoSubmit={handleNewTodoSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <TodoList
            displayedTodos={displayedTodos}
            tempTodo={tempTodo}
            handleCompletedStatus={handleCompletedStatus}
            handleFormSubmitEdited={handleFormSubmitEdited}
            handleDelete={handleDelete}
            isLoadingArr={isLoadingArr}
            setEditTodo={setEditTodo}
            editTodo={editTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorBin
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />

    </div>
  );
};
