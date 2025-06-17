/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import { Filter } from './types/Filter';

import { TodoList } from './components/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const [filterField, setFilterField] = useState<Filter>(Filter.All);

  const {
    todos,
    errorMessage,
    processingTodoIds,
    inputRef,
    setErrorMessage,
    handleDeleteTodo,
    handleClearCompleted,
    handleAddTodo,
    handleToggleCompleted,
    handleToggleAllCompleted,
    handleRenameTodo,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleAddTodo={handleAddTodo}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
          handleToggleAllCompleted={handleToggleAllCompleted}
        />

        <TodoList
          todos={todos}
          filterField={filterField}
          handleDeleteTodo={handleDeleteTodo}
          processingTodoIds={processingTodoIds}
          handleToggleCompleted={handleToggleCompleted}
          handleRenameTodo={handleRenameTodo}
          inputRef={inputRef}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterField={filterField}
            processingTodoIds={processingTodoIds}
            setFilterField={setFilterField}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
