/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  title: string;
  editTitleRef: React.RefObject<HTMLInputElement>;
  isUpdatingId: number;
  isEditingId: number;
  isLoading?: boolean;
  isDeletingId: number;
  onDeleteTodo: (todoId: number) => void;
  onCompleteTodo: ({ id, ...todoData }: Todo) => void;
  onSaveTitle: (title: string) => void;
  onSaveEditingId: (todoId: number) => void;
  onCancelEdit: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onHandleEdit: (event: React.FormEvent<HTMLFormElement>) => void;
  onHandleBlur: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  title,
  editTitleRef,
  isUpdatingId,
  isLoading,
  isEditingId,
  isDeletingId,
  onDeleteTodo,
  onCompleteTodo,
  onSaveTitle,
  onSaveEditingId,
  onCancelEdit,
  onHandleEdit,
  onHandleBlur,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onCompleteTodo(todo)}
        />
      </label>

      {isEditingId === todo.id ? (
        <form onSubmit={onHandleEdit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={editTitleRef}
            className="todo__title-field"
            value={title}
            onChange={event => onSaveTitle(event.target.value)}
            onKeyUp={onCancelEdit}
            onBlur={onHandleBlur}
            placeholder="Empty todo will be deleted"
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              onSaveTitle(todo.title);
              onSaveEditingId(todo.id);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isLoading || isUpdatingId === todo.id || isDeletingId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
