/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useRef, useState } from 'react';
type Props = {
  todo: Todo;
  isLoading?: boolean;
  isEditing?: boolean;
  onDeleteTodo: (id: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  setEditingTodo: (id: number | null) => void;
};
export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  isEditing,
  onDeleteTodo,
  onUpdateTodo,
  setEditingTodo,
}) => {
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeStatus = () => {
    const toUpdate = { ...todo, completed: !todo.completed };

    onUpdateTodo(toUpdate);
  };

  const changeTitle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todo.title === editingTitle.trim()) {
      setEditingTodo(null);

      return;
    }

    if (editingTitle.trim() === '') {
      try {
        await onDeleteTodo(todo.id);
        setEditingTodo(null);
      } catch (error) {
        inputRef?.current?.focus();
      }

      return;
    }

    try {
      await onUpdateTodo({ ...todo, title: editingTitle.trim() });
      setEditingTodo(null);
    } catch (error) {
      inputRef?.current?.focus();
    }
  };

  const cancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
      setEditingTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onChangeStatus}
        />
      </label>
      {isEditing ? (
        <form onBlur={changeTitle} onSubmit={changeTitle}>
          <input
            autoFocus
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={event => setEditingTitle(event.target.value)}
            onKeyUp={cancelEditing}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingTodo(todo.id)}
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
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
