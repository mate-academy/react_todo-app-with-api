import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  editingTodoId: number | null;
  onTodoStatus: (todoId: number) => Promise<void> | undefined;
  list: Todo[];
  onDelete: (todoId: number) => Promise<void>;
  idTodo: number;
  onStartEditing: (todo: Todo) => void;
  editTitle: string;
  onEditChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: () => void;
  loading: boolean;
  loadingTodoIds: number[];
  isToggleAllLoading: boolean;
}

export const TodoList: React.FC<Props> = ({
  list,
  onDelete,
  onTodoStatus,
  onStartEditing,
  editTitle,
  onEditChange,
  onSaveEdit,
  editingTodoId,
  loadingTodoIds,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSaveEdit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onStartEditing({ id: 0, title: '', completed: false, userId: 0 });
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {list.map(({ title, id, completed, userId }) => (
        <div data-cy="Todo" className={cn('todo', { completed })} key={id}>
          {/* eslint-disable jsx-a11y/label-has-associated-control  */}
          <label className="todo__status-label" htmlFor={String(id)}>
            <input
              id={String(id)}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => onTodoStatus(id)}
            />
          </label>

          {id === editingTodoId ? (
            <input
              type="text"
              className="todo todo__title"
              value={editTitle}
              onChange={onEditChange}
              onBlur={onSaveEdit}
              data-cy="TodoTitleField"
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() =>
                onStartEditing({ id, title, completed, userId })
              }
            >
              {title}
            </span>
          )}

          {id !== editingTodoId && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          )}

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': loadingTodoIds.includes(id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
