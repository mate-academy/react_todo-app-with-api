import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoID: number) => void;
  onUpdate: (id: number, todo: Todo) => void;
  hasLoader: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  hasLoader,
}) => {
  const [updateTitle, setUpdateTitle] = useState<string>('');
  const [isHidenButton, setIsHidenButton] = useState(false);
  const [isEdited, setIsEdited] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleTodoDelete = (todoId: number) => {
    onDelete(todoId);
  };

  const handleUpdateTodoStatus = async () => {
    onUpdate(todo.id, {
      ...todo,
      completed: !todo.completed,
    });
  };

  const updateTodoTitle = () => {
    if (updateTitle.trim() && updateTitle !== todo.title) {
      onUpdate(todo.id, {
        ...todo,
        title: updateTitle,
      });
      setIsEdited(null);
      setIsHidenButton(false);
      setUpdateTitle('');
    } else {
      if (!updateTitle) {
        onDelete(todo.id);
      }

      setIsEdited(null);
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
      setIsEdited(null);
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
          onChange={handleUpdateTodoStatus}
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
            onDoubleClick={() => setIsEdited(todo.id)}
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

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': hasLoader.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
