/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  visibleTodos: Todo[];
  handleCheckTodo: (todo: Todo) => Promise<void>;
  handleEditTodo: (title: string, todo: Todo) => void;
  editingId: number;
  setEditingId: (prop: number) => void;
  editTitle: string;
  setEditTitle: (prop: string) => void;
  handleDelete: (id: number) => Promise<void>;
  isLoadingId: number | null;
};

const Main: React.FC<Props> = ({
  visibleTodos,
  handleCheckTodo,
  handleDelete,
  handleEditTodo,
  setEditTitle,
  setEditingId,
  editTitle,
  editingId,
  isLoadingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const { id, completed, title } = todo;

        return (
          <div
            key={id}
            data-cy="Todo"
            className={classNames('todo', { completed: completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onChange={() => handleCheckTodo(todo)}
                checked={completed}
              />
            </label>

            {editingId === todo.id ? (
              <form
                onSubmit={event => {
                  event.preventDefault();
                  handleEditTodo(editTitle, todo);
                }}
              >
                <input
                  onKeyDown={event => {
                    if (event.key === 'Escape' || event.key === 'ArrowUp') {
                      setEditingId(-1);
                    }
                  }}
                  onBlur={() => handleEditTodo(editTitle, todo)}
                  data-cy="TodoTitleField"
                  type="text"
                  value={editTitle}
                  onChange={event => setEditTitle(event.target.value)}
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  autoFocus
                />
              </form>
            ) : (
              <>
                <span
                  onDoubleClick={() => {
                    setEditingId(todo.id);
                    setEditTitle(todo.title);
                  }}
                  data-cy="TodoTitle"
                  className="todo__title"
                >
                  {title}
                </span>
                <button
                  disabled={id === isLoadingId}
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDelete(id)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isLoadingId === id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Main;
