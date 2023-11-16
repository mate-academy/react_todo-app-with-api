/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoItem } from './components/TodoItem';
import { FilterBy, TodosContext } from './TodoContext';

export enum Key {
  Enter = 'Enter',
  Escape = 'Escape',
}

const USER_ID = 11880;

export const App: React.FC = () => {
  const {
    allTodos,
    setAllCompleted,
    onSubmit,
    newTodoTitle,
    handleTitleChange,
    isRendering,
    tempTodo,
    filteredTodos,
    onDelete,
    activeTodos,
    filterBy,
    handleFilterClick,
    clearCompleted,
    completedTodos,
    error,
    setError,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, allTodos, filteredTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {allTodos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${allTodos.every(todo => todo.completed) ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={() => setAllCompleted()}
            />
          )}
          <form onSubmit={onSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleTitleChange}
              ref={inputRef}
              disabled={isRendering}
            />
          </form>
        </header>

        <section
          className="todoapp__main"
          data-cy="TodoList"
        >
          {filteredTodos.map(todo => {
            return (
              <TodoItem key={todo.id} todo={todo} />
            );
          })}

          {tempTodo && (
            <div
              key={tempTodo.id}
              data-cy="Todo"
              className={classNames('todo', { completed: tempTodo?.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo?.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo?.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(tempTodo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={`modal overlay ${tempTodo ? 'is-active' : ''}`}
              >
                <div className="modal-background
                    has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {allTodos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filterBy === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={handleFilterClick(FilterBy.All)}
              >
                All
              </a>

              <a
                href="#/"
                className={`filter__link ${filterBy === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={handleFilterClick(FilterBy.Active)}
              >
                Active
              </a>

              <a
                href="#/"
                className={`filter__link ${filterBy === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={handleFilterClick(FilterBy.Completed)}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompleted}
              disabled={completedTodos.length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
