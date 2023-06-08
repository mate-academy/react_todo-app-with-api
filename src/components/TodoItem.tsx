/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  isProcessed: boolean;
  onUpdateTodo?: (todoId: number, data: any) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  isProcessed,
  onUpdateTodo = () => {},
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [title, setTitle] = useState('');

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    onUpdateTodo(todo.id, { completed: checked });
  };

  const handleSetIsEdited = () => {
    setIsEdited(true);

    setTitle(todo.title);
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitle(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title === todo.title) {
      setIsEdited(false);

      return;
    }

    if (!title.trim()) {
      setIsEdited(false);

      onDelete(todo.id);

      return;
    }

    onUpdateTodo(todo.id, { title });

    setIsEdited(false);
  };

  const handleCancelEditing = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEdited(false);
    }
  };

  return (
    <li
      key={todo.id}
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isProcessed}
          onChange={handleChange}
        />
      </label>

      {isEdited ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={handleChangeTitle}
            onKeyUp={handleCancelEditing}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleSetIsEdited}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames(
        'modal',
        'overlay',
        { 'is-active': isProcessed },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
