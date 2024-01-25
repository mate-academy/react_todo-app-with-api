import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  updateTodo: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  updateTodo,
}) => {
  const {
    title, completed, id, loading,
  } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      titleField.current?.focus();
    }

    // console.log(`useEf: ${isEditing}`);
  }, [isEditing]);

  const handleCompleted = () => {
    updateTodo({
      ...todo,
      completed: !completed,
    });
  };

  const handleEditComplete = () => {
    setNewTitle(currentTitle => currentTitle.trim());

    if (!newTitle) {
      onDelete(id);
    } else if (newTitle !== title) {
      updateTodo({
        ...todo,
        title: newTitle,
      }).then(() => {
        setIsEditing(false);
        // console.log(`then: ${isEditing}`);
      })
        .catch(() => {
          // console.log(`catch: ${isEditing}`);
          setIsEditing(true);
        });
    } else {
      setIsEditing(false);
    }
  };

  const handleEditTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleEditComplete();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCompleted}
          disabled={loading}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {newTitle}
          </span>

          <button
            data-cy="TodoDelete"
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
            disabled={loading}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleEditTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            placeholder="Empty todo will be deleted"
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyUp={handleKeyUp}
            onBlur={handleEditComplete}
            ref={titleField}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay', {
            'is-active': loading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
