import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';
import { ToggleStatus } from '../types/ToggleStatus';

type Props = {
  todo: Todo;
  deleteAll: boolean;
  changeAll: ToggleStatus | null;
  deleteTodo: (id: number) => Promise<void>;
  changeTodo: (id: number, data: boolean | string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  changeAll,
  deleteAll,
  deleteTodo,
  changeTodo,
}) => {
  const { id, title, completed } = todo;

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title);

  const editForm = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editForm.current?.focus();
    }
  }, [isEditing]);

  const deleteItem = async () => {
    setIsLoading(true);

    try {
      await deleteTodo(id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletedStatus = async () => {
    setIsLoading(true);

    try {
      await changeTodo(id, !completed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = async () => {
    if (!inputValue) {
      deleteItem();

      return;
    }

    if (inputValue === title) {
      setIsEditing(false);
    }

    if (inputValue !== title) {
      setIsLoading(true);
      try {
        await changeTodo(id, inputValue);
        setIsEditing(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed })}>
        <label className="todo__status-label">
          <input
            aria-label={`Mark ${title} as ${completed ? 'incomplete' : 'complete'}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={handleCompletedStatus}
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
              value={inputValue}
              ref={editForm}
              onChange={handleInputChange}
              onBlur={handleTitleChange}
              onKeyDown={handleKeyDown}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={deleteItem}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active':
              isLoading ||
              (deleteAll && completed) ||
              (changeAll === ToggleStatus.completed && completed) ||
              (changeAll === ToggleStatus.active && !completed),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
