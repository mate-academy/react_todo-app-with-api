import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (arg: number) => void;
  onEdit?: (id: number, arg: Partial<Todo>) => void;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onEdit,
  isLoading,
}) => {
  const { id, title, completed } = todo;
  const [isEditable, setIsEditable] = useState(false);
  const [value, setValue] = useState(title);
  const inputEditRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputEditRef.current) {
      inputEditRef.current.focus();
    }
  }, [isEditable]);

  const handleClickOnTitle = () => {
    setIsEditable(true);
  };

  const onEditTitle = () => {
    setValue(value);

    if (onEdit) {
      onEdit(id, { title: value });
    }
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onEditTitle();
  };

  const handleCheck = () => {
    if (onEdit) {
      onEdit(id, { completed: !completed });
    }
  };

  const handleOnBlur = () => {
    onEditTitle();

    setIsEditable(false);
  };

  const handleDeleteTodo = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={handleCheck}
        />
      </label>

      {isEditable ? (
        <form onSubmit={handleOnSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={handleOnBlur}
            ref={inputEditRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleClickOnTitle}
          >
            {value}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
