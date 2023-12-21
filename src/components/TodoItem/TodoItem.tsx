import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoID: number) => void;
  isProcessing: Todo | null;
  onProcessing: (todo: Todo | null) => void;
  onUpdate: (id: number, todo: Todo) => void;
  isEdited: number | null;
  onEdit: (todoId: number | null) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isProcessing,
  onUpdate,
  isEdited,
  onEdit,
  isLoading,
  onProcessing,
}) => {
  const [updateTitle, setUpdateTitle] = useState<string>('');
  const [isHidenButton, setIsHidenButton] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleTodoDelete = (todoId: number) => {
    onDelete(todoId);
  };

  const handleUpdateTodoStatus = async () => {
    try {
      onProcessing(todo);

      await onUpdate(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
    } finally {
      onProcessing(null);
    }
  };

  const updateTodoTitle = () => {
    if (updateTitle.trim() !== '' && updateTitle !== todo.title) {
      onUpdate(todo.id, {
        ...todo,
        title: updateTitle,
      });

      onEdit(null);
      setIsHidenButton(false);
      setUpdateTitle('');
    } else if (!updateTitle) {
      onDelete(todo.id);
      onEdit(null);
    } else {
      onEdit(null);
    }
  };

  const handleUpdateTodoTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    if (isEdited) {
      setUpdateTitle(event.target.value);
    }
  };

  useEffect(() => {
    if (isEdited && inputRef.current) {
      inputRef.current.focus();
      setUpdateTitle(todo.title);
      setIsHidenButton(true);
    }
  }, [isEdited, setIsHidenButton, todo.title]);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onEdit(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleUpdateTodoStatus()}
          onClick={() => onProcessing(todo)}
        />
      </label>

      {isEdited === todo.id
        ? (
          <form onSubmit={updateTodoTitle}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              defaultValue={todo.title}
              value={updateTitle || ''}
              onChange={handleUpdateTodoTitle}
              onBlur={updateTodoTitle}
              onKeyUp={handleKeyUp}
            />
          </form>
        )
        : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onEdit(todo.id)}
          >
            {todo.title}
          </span>
        )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleTodoDelete(todo.id)}
        hidden={isHidenButton}
      >
        ×
      </button>

      {isProcessing
        ? (
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': isProcessing.id === todo.id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        ) : (
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': isLoading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
    </div>
  );
};
