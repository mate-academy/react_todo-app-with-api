import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: (todoId: number) => Promise<void>;
  onUpdate?: (todo: Todo) => Promise<void>;
  isLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => Promise.resolve(),
  onUpdate = () => Promise.resolve(),
  isLoading,
}) => {
  const [isChecked, setIsChecked] = useState(todo.completed);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [tempTitle, setTempTitle] = useState(todo.title);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const todoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsChecked(todo.completed);
  }, [todo.completed]);

  useEffect(() => {
    if (isEditing && todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setTempTitle(todo.title);
      }
    };

    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditing, todo.title]);

  // #region eventHandlers

  const handleChange = (changedTodo: Todo) => {
    setIsLocalLoading(true);

    onUpdate({ ...changedTodo, completed: !changedTodo.completed })
      .then(() => {
        setIsChecked(!changedTodo.completed);
      })
      .finally(() => {
        setIsLocalLoading(false);
      });
  };

  const handleDelete = () => {
    setIsLocalLoading(true);

    onDelete(todo.id).finally(() => {
      setIsLocalLoading(false);
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = tempTitle.trim();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    setIsLocalLoading(true);

    if (trimmedTitle === todo.title) {
      setIsLocalLoading(false);
      setIsEditing(false);
      setIsSubmitting(false);
      return;
    }

    if (trimmedTitle) {
      onUpdate({ ...todo, title: trimmedTitle })
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {
          if (todoInputRef.current) {
            todoInputRef.current.focus();
          }
        })
        .finally(() => {
          setIsLocalLoading(false);
          setIsSubmitting(false);
        });
    } else {
      onDelete(todo.id)
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {
          if (todoInputRef.current) {
            todoInputRef.current.focus();
          }
        })
        .finally(() => {
          setIsLocalLoading(false);
          setIsSubmitting(false);
        });
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleSubmit(event);
  };

  // #endregion

  const isTodoLoading = isLoading || isLocalLoading;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: isChecked,
      })}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={() => {
            handleChange(todo);
          }}
          onDoubleClick={() => {
            setIsEditing(true);
          }}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            ref={todoInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={tempTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
          // autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isTodoLoading || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
