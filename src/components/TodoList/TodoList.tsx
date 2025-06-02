import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  loading: boolean;
  todos: Todo[];
  setSelectedStatus: (selectedStatus: string) => void;
  selectedStatus: string;
  setErrorMessage: (status: string) => void;
  errorMessage: string;
  onDelete: (todoId: number) => void;
  onAdd: (newTitle: string) => void;
  onUpdate: (todoId: number, data: object) => void;
  inputDisabled: boolean;
  tempTodo: Todo | null;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  updatingTodoId: number | null;
  clearCompletedTodos: (ids: number[]) => void;
  editingTitleId: number | null;
  setEditingTitleId: (todoId: number | null) => void;
}

export const TodoList: React.FC<Props> = ({
  loading,
  todos,
  setSelectedStatus,
  selectedStatus,
  setErrorMessage,
  errorMessage,
  onDelete,
  onAdd,
  onUpdate,
  inputDisabled,
  tempTodo,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
  updatingTodoId,
  clearCompletedTodos,
  editingTitleId,
  setEditingTitleId,
}) => {
  // Selecting todos to be displayed based on the filter status
  const visibleTodos = todos.filter(todo => {
    if (selectedStatus === 'active') {
      return !todo.completed;
    }

    if (selectedStatus === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // Calculating the number of todos left to complete
  const todosLeftCount = todos.reduce(
    (count, todo) => (todo.completed ? count : count + 1),
    0,
  );

  const todosCompletedIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {!loading && (
        <div className="todoapp__content">
          <header className="todoapp__header">
            {/* this button should have `active` class only if all todos are completed */}
            {todos.length !== 0 && !loading && (
              <button
                type="button"
                className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
                data-cy="ToggleAllButton"
                onClick={() => {
                  if (todos.every(todo => todo.completed)) {
                    todos.map(todo => onUpdate(todo.id, { completed: false }));
                  } else {
                    todos.map(todo => {
                      if (todo.completed === false) {
                        onUpdate(todo.id, { completed: true });
                      }
                    });
                  }
                }}
              />
            )}

            {/* Add a todo on form submit */}
            <form
              onSubmit={event => {
                event.preventDefault();

                const trimmedTitle = newTodoTitle.trim();

                if (!trimmedTitle) {
                  setErrorMessage('Title should not be empty');

                  return;
                }

                onAdd(trimmedTitle);
              }}
            >
              <input
                ref={inputRef}
                data-cy="NewTodoField"
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                autoFocus
                value={newTodoTitle}
                onChange={event => setNewTodoTitle(event.target.value)}
                disabled={inputDisabled}
              />
            </form>
          </header>

          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDelete}
                onUpdate={onUpdate}
                isUpdating={updatingTodoId === todo.id}
                isEditingTitle={editingTitleId === todo.id}
                setEditingTitleId={setEditingTitleId}
              />
            ))}

            {tempTodo && (
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    aria-label={`Temp todo`}
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                >
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>

          {/* Footer */}
          {todos.length > 0 && (
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todosLeftCount} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={`filter__link ${selectedStatus === 'all' ? 'selected' : ''}`}
                  data-cy="FilterLinkAll"
                  onClick={() => setSelectedStatus('all')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={`filter__link ${selectedStatus === 'active' ? 'selected' : ''}`}
                  data-cy="FilterLinkActive"
                  onClick={() => setSelectedStatus('active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={`filter__link ${selectedStatus === 'completed' ? 'selected' : ''}`}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setSelectedStatus('completed')}
                >
                  Completed
                </a>
              </nav>

              {/* this button should be disabled if there are no completed todos */}
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={todosCompletedIds.length === 0}
                onClick={() => clearCompletedTodos(todosCompletedIds)}
              >
                Clear completed
              </button>
            </footer>
          )}
        </div>
      )}

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
