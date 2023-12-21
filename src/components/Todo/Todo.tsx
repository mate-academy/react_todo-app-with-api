/* eslint-disable jsx-a11y/no-autofocus */
import { Dispatch, SetStateAction, useState } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../../types/Todo';

interface Props {
  todo: TodoType,
  onDelete?: (id: number) => void,
  onUpdate?: (updateteTodo: TodoType) => void;
  isEditing?: boolean,
  setEditing?: Dispatch<SetStateAction<number | null>>,

}

export const Todo: React.FC<Props> = (
  {
    todo,
    onDelete,
    onUpdate,
    isEditing,
    setEditing,
  },
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await onDelete?.(todo.id);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async () => {
    setIsLoading(true);
    try {
      await onUpdate?.({ ...todo, completed: !todo.completed });
    } finally {
      setIsLoading(false);
    }
  };

  const saveUpdatedTitle = async () => {
    setIsLoading(true);

    try {
      await onUpdate?.({ ...todo, title });
    } finally {
      setEditing?.(null);
      setIsLoading(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        {
          'todo completed': todo.completed,
        })}
      onDoubleClick={() => setEditing?.(todo.id)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleComplete}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={e => {
              e.preventDefault();

              if (title.length === 0) {
                handleDelete();
              } else {
                saveUpdatedTitle();
              }
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onChange={event => setTitle(event.target.value)}
              onBlur={saveUpdatedTitle}
              autoFocus
            />
          </form>
        )
        : (
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
        )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': isLoading || todo.id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
