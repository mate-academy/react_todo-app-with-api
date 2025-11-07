/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { FC, FormEvent, KeyboardEvent, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (todoId: Todo['id']) => void;
  onChangeTodo?: (todo: Todo) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onChangeTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleChangeCompleted = () => {
    onChangeTodo?.({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleSubmit = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      onDelete?.(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const updatedTodo = { ...todo, title: trimmedTitle };

    try {
      await onChangeTodo?.(updatedTodo);
      setIsEditing(false);
    } catch {}
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleSubmit();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeCompleted}
        />
      </label>

      {isEditing ? (
        <form onSubmit={onFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setEditedTitle(todo.title);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
