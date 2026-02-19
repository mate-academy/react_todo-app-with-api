import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { FooterTodo } from './components/FooterTodo';
import { Errors } from './components/Errors';
import { HeaderTodo } from './components/HeaderTodo';
import { useTodoService } from './hooks/useTodoService';
import { SortOrder } from './types/SortOrder';

export const App: React.FC = () => {
  const {
    todos,
    title,
    setTitle,
    errorMessage,
    setErrorMessage,
    isAdding,
    tempTodo,
    loadingIds,
    editingId,
    setEditingId,
    todoInputRef,
    activeTodos,
    handleSubmit,
    onDelete,
    onDeleteAll,
    todoStatus,
    handleToggleAll,
    renameTodo,
  } = useTodoService();

  const [sorted, setSorted] = useState(SortOrder.ALL);

  const sortedTodoes = todos.filter(todo => {
    switch (sorted) {
      case SortOrder.ACTIVE:
        return !todo.completed;
      case SortOrder.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodo
          todos={todos}
          todoInputRef={todoInputRef}
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          isAdding={isAdding}
          handleToggleAll={handleToggleAll}
        />

        <TodoList
          sortedTodoes={sortedTodoes}
          onDelete={onDelete}
          loadingIds={loadingIds}
          todoStatus={todoStatus}
          renameTodo={renameTodo}
          setEditingId={setEditingId}
          editingId={editingId}
        />

        {tempTodo && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                aria-label="Mark todo as completed"
                type="checkbox"
                className="todo__status"
                data-cy="TodoStatus"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button type="button" className="todo__remove">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {todos.length && (
          <FooterTodo
            activeTodos={activeTodos}
            sorted={sorted}
            setSorted={setSorted}
            todos={todos}
            onDeleteAll={onDeleteAll}
          />
        )}
      </div>

      <Errors errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
