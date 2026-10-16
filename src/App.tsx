import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { ErrorMessage } from './types/ErrorMessage';
import { Header } from './components/Header';
import { useTodos } from './hooks/useTodos';

export const App: React.FC = () => {
  const {
    todos,
    preperedTodos,
    errorMessage,
    status,
    setStatus,
    query,
    setQuery,
    tempTodo,
    isInputDisabled,
    loadingTodoIds,
    focusedInput,
    itemsLeft,
    isCompletedTodo,
    handleSetError,
    addTodo,
    deleteTodo,
    deleteAllCompleteTodos,
    changeStatusTodo,
    toggleAllTodosComplete,
    handleRename,
    areAllTodosCompleted,
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
          query={query}
          onChangeQuery={setQuery}
          areCompleted={areAllTodosCompleted}
          inputRef={focusedInput}
          isInputDisabled={isInputDisabled}
          onAddTodo={addTodo}
          onChangeStatusAllTodos={toggleAllTodosComplete}
        />

        <TodoList
          todos={preperedTodos}
          tempTodo={tempTodo}
          todoId={loadingTodoIds}
          onDelete={id => {
            void deleteTodo(id).catch(() => {});
          }}
          onChangeStatus={changeStatusTodo}
          onRename={handleRename}
        />

        {todos.length > 0 && (
          <Footer
            itemsLeft={itemsLeft}
            status={status}
            onChangeStatus={setStatus}
            isCompletedTodo={isCompletedTodo}
            onClearCopletedTodos={deleteAllCompleteTodos}
          />
        )}
      </div>

      <ErrorNotification
        error={errorMessage}
        onDeleteMessage={() => handleSetError(ErrorMessage.None)}
      />
    </div>
  );
};
