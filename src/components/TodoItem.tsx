/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useRef, useEffect } from 'react';

type Props = {
  tod: Todo;
  handleRemoveTodo: (id: number) => void;
  handleError: (message: string) => void;
  isLoading: boolean;
  loadingTodoId: number[];
  handleUpdateTodoChecked: (todo: { id: number; completed: boolean }) => void;
  handleUpdateTitle: (args: { id: number; title: string }) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  tod: { id, title, completed },
  handleRemoveTodo,
  isLoading,
  loadingTodoId,
  handleUpdateTodoChecked,
  handleUpdateTitle,
  handleError,
}) => {
  const [isEditingTodo, setEditingTodo] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(title);

  const isDeleting = Array.isArray(loadingTodoId) && loadingTodoId.includes(id);
  const isAdding = isLoading && id === 0;

  const titleFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTodo && titleFocus.current) {
      titleFocus.current.focus();
    }
  }, [isEditingTodo]);

  const [isEditing, setIsEditing] = useState(false);

  const keyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isEditing) {
      const trimmedTitle = editTitle.trim();

      if (trimmedTitle === title.trim()) {
        setEditingTodo(false);

        return;
      }

      if (trimmedTitle === '') {
        handleRemoveTodo(id);

        return;
      }

      setIsEditing(true);
      try {
        await handleUpdateTitle({ id, title: trimmedTitle });
        setEditingTodo(false);
      } catch {
        handleError('Unable to update a todo');
      } finally {
        setIsEditing(false);
      }
    }

    if (event.key === 'Escape') {
      setEditingTodo(false);
    }
  };

  const loseBlur = async () => {
    if (!isEditing) {
      const trimmedTitle = editTitle.trim();

      if (trimmedTitle === '') {
        handleRemoveTodo(id);

        return;
      }

      if (trimmedTitle === title.trim()) {
        setEditingTodo(false);

        return;
      }

      setIsEditing(true);
      try {
        await handleUpdateTitle({ id, title: trimmedTitle });
        setEditingTodo(false);
      } catch {
        handleError('Unable to update a todo');
      } finally {
        setIsEditing(false);
      }
    }
  };

  return (
    <div
      data-cy="Todo"
      className={completed ? 'todo completed' : 'todo'}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdateTodoChecked({ id, completed })}
        />
      </label>

      {!isEditingTodo && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingTodo(true);
            setEditTitle(title);
          }}
        >
          {title}
        </span>
      )}

      {isEditingTodo && (
        <form onSubmit={e => e.preventDefault()}>
          <input
            ref={titleFocus}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onKeyUp={keyDown}
            onBlur={loseBlur}
          />
        </form>
      )}

      {!isEditingTodo && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleRemoveTodo(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDeleting || isAdding,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
