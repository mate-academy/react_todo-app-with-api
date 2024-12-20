/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  tempTodo: Todo | null;
  editedValue: string;
  editedInputById: number;
  idsOfTodosWithLoader: number[];
  editedInputRef: React.MutableRefObject<HTMLInputElement | null>;
  onDelete: (id: number) => void;
  onSelect: (id: number, todo: Todo) => void;
  setForm: (id: number) => void;
  setEditedValue: (str: string) => void;
  onSubmitChangedInput: (event: React.FormEvent) => void;
  keyUp: (event: React.KeyboardEvent) => void;
}

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    tempTodo,
    editedValue,
    editedInputById,
    idsOfTodosWithLoader,
    editedInputRef,
    onDelete,
    onSelect,
    setForm,
    setEditedValue,
    onSubmitChangedInput,
    keyUp,
  }) => {
    const { completed, title, id } = todo;

    return (
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed: completed,
        })}
        onDoubleClick={() => setForm(id)}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => onSelect(id, { ...todo, completed: !completed })}
          />
        </label>

        {editedInputById === id ? (
          <form onSubmit={onSubmitChangedInput}>
            <input
              ref={editedInputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedValue}
              onBlur={onSubmitChangedInput}
              onChange={event => setEditedValue(event.target.value)}
              onKeyUp={keyUp}
            />
          </form>
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}
        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active':
              tempTodo?.id === id || idsOfTodosWithLoader.includes(id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
