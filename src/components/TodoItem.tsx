/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  onUpdate?: (todo: Todo) => void;
  loadingTodoId?: number;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onUpdate = () => {},
  loadingTodoId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const savingRef = useRef(false);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      field.current?.focus();
    }
  }, [isEditing]);

  const saveTitle = () => {
    if (savingRef.current) {
      return;
    }

    if (todoTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const trimmedTitle = todoTitle.trim();

    if (trimmedTitle === '') {
      onDelete(todo.id);

      return;
    }

    savingRef.current = true;

    Promise.resolve(onUpdate({ ...todo, title: trimmedTitle }))
      .then(() => setIsEditing(false))
      .catch(() => {
        setIsEditing(true);
        field.current?.focus();
      })
      .finally(() => {
        savingRef.current = false;
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleBlur = () => {
    saveTitle();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    saveTitle();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames([
        'todo',
        {
          completed: todo.completed,
        },
      ])}
    >
      <label htmlFor={`todo-status-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onUpdate({ ...todo, completed: !todo.completed })}
        />
      </label>

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            ref={field}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      )}

      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}

      <div
        data-cy="TodoLoader"
        className={classNames([
          'modal',
          'overlay',
          {
            'is-active': loadingTodoId === todo.id,
          },
        ])}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
