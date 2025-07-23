/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrorMessage } from './components/TodoErrorMessage';
import { TodoItem } from './components/TodoItem';
import { useTodos } from './hooks/useTodos';

export const App: FC = () => {
  const {
    todos,
    visibleTodos,
    tempTodo,
    status,
    loading,
    isSubmitting,
    errorMessage,
    submittingTodoIds,
    setStatus,
    setErrorMessage,
    createTodo,
    updateTodo,
    deleteTodo,
    deleteCompletedTodos,
    toggleAll,
  } = useTodos();

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          isSubmitting={isSubmitting}
          onCreate={createTodo}
          onToggle={toggleAll}
          onError={setErrorMessage}
        />

        {!loading && (
          <>
            <TodoList
              todos={visibleTodos}
              submittingTodoIds={submittingTodoIds}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                isSubmitting={isSubmitting}
                onUpdate={() => Promise.resolve()}
                onDelete={() => Promise.resolve()}
              />
            )}
          </>
        )}

        {!loading && todos.length > 0 && (
          <TodoFooter
            todos={todos}
            status={status}
            onStatusChange={setStatus}
            onDeleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>
      <TodoErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
