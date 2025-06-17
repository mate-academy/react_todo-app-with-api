/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const {
    isLoadingTodos,
    isUpdatingTodo,
    todos,
    tempTodo,
    deletedTodoId,
    toggledTodoId,
    errorMessage,
    newTitle,
    updateTitle,
    selectStatusTodos,
    visibleTodos,
    isActive,

    setNewTitle,
    setUpdateTitle,
    setSelectStatusTodos,
    setDeletedTodoId,
    setToggledTodoId,
    setErrorMessage,

    handleAddTodo,
    handleChangeTodo,
    handleChangeAllTodos,
    handleDeleteTodo,
    handleDeleteCompleted,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoadingTodos={isLoadingTodos}
          isActive={isActive}
          newTitle={newTitle}
          todosLength={todos.length}
          onChangeNewTitle={setNewTitle}
          addTodo={handleAddTodo}
          onErrorMessage={setErrorMessage}
          onChangeAllTodos={handleChangeAllTodos}
        />

        {isLoadingTodos ? (
          'Loading....'
        ) : (
          <TodoList
            isUpdatingTodo={isUpdatingTodo}
            visibleTodos={visibleTodos}
            deletedTodoId={deletedTodoId}
            toggledTodoId={toggledTodoId}
            updateTitle={updateTitle}
            tempTodo={tempTodo}
            onChangeDeletedTodoId={setDeletedTodoId}
            onDeleteTodo={handleDeleteTodo}
            onChangeTodo={handleChangeTodo}
            onToggledTodoId={setToggledTodoId}
            onUpdateTitle={setUpdateTitle}
          />
        )}

        {todos.length > 0 && !isLoadingTodos && (
          <Footer
            todos={todos}
            selectStatusTodos={selectStatusTodos}
            onChangeStatusTodos={setSelectStatusTodos}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
