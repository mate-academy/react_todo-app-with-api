/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { EditingItem } from '../../types/EditingItem';

type Props = {
  todo: Todo;
  onStatusChange: (todo: Todo) => void;
  onUpdateSubmit: (event: React.FormEvent) => void;
  editingItem: EditingItem;
  startEditing: (todo: Todo) => void;
  updateEditingTitle: (editedTitle: string) => void;
  onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  deleteTodo: (id: number) => void;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  isSaving?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onStatusChange,
  onUpdateSubmit,
  editingItem,
  startEditing,
  updateEditingTitle,
  onKeyUp,
  deleteTodo,
  deletingTodoIds,
  updatingTodoIds,
  isSaving = false,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            onStatusChange({ ...todo, completed: !todo.completed })
          }
        />
      </label>

      {editingItem.selectedTodo?.id === todo.id ? (
        <form onSubmit={event => onUpdateSubmit(event)}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingItem.editedTitle}
            onChange={event => updateEditingTitle(event.target.value)}
            onBlur={event => onUpdateSubmit(event)}
            onKeyUp={event => onKeyUp(event)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              startEditing(todo);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            deletingTodoIds.includes(todo.id) ||
            updatingTodoIds.includes(todo.id) ||
            (isSaving && todo.id === 0),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
