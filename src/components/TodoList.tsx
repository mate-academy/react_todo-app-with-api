import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  handleComplete: (id: number, completed: boolean) => void,
  handleDelete: (id: number) => void,
  isUpdatingId: number[],
  isEditing: number | null,
  handleEdit: (id: number, title: string) => void,
  query: string,
  setQuery: (title: string) => void
  handleEditSubmit: (query: string, id: number) => void,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  handleComplete,
  handleDelete,
  isUpdatingId,
  isEditing,
  handleEdit,
  query,
  setQuery,
  handleEditSubmit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const {
          id,
          title,
          completed,
        } = todo;

        return (
          <div
            id={`${id}`}
            key={id}
            data-cy="Todo"
            className={cn('todo', { completed })}
          >
            <label className="todo__status-label">
              <input
                id={`${id}`}
                key={id}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
                readOnly
                onClick={() => {
                  handleComplete(id, completed);
                }}
              />
            </label>

            {isEditing === id ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleEditSubmit(query, id);
                }}
              >
                <input
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                  onBlur={() => {
                    handleEditSubmit(query, id);
                  }}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    handleEdit(id, title);
                  }}
                >
                  {title}
                </span>

                {/* // Remove button appears only on hover */}
                <button
                  id={`${id}`}
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => {
                    handleDelete(id);
                  }}
                >
                  ×
                </button>
              </>
            )}
            {/* overlay will cover the todo while it is being updated */}
            <div
              data-cy="TodoLoader"
              className={cn(
                'modal',
                'overlay',
                { 'is-active': isUpdatingId.some(ids => ids === id) },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
});
