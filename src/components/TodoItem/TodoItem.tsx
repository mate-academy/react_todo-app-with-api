/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onTodoRemove?: (id: number) => void;
  onTodoUpdate: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onTodoRemove = () => {},
  onTodoUpdate,
}) => {
  const { completed, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleRemoveTodo = () => {
    onTodoRemove(id);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTodoUpdate({ ...todo, completed: event.target.checked });
  };

  const handleTitleChange = () => {
    const trimmedTitle = title.trim();

    setTitle(trimmedTitle);

    if (trimmedTitle === '') {
      onTodoRemove(id);
    } else if (trimmedTitle !== todo.title) {
      onTodoUpdate({ ...todo, title: trimmedTitle }).then(() =>
        setIsEditing(false),
      );
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={event => handleStatusChange(event)}
        />
      </label>
      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleTitleChange();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setTitle(todo.title);
                setIsEditing(false);
              }
            }}
            onBlur={handleTitleChange}
            autoFocus
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
            onClick={handleRemoveTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
