import { FormEvent, useState } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../../types/Todo';

interface Props {
  todo: TodoType,
  onDelete?: (id: number) => void,
  onUpdate?: (updateteTodo: TodoType) => void;
  loadingIds?: number[],

}

export const Todo: React.FC<Props> = (
  {
    todo,
    onDelete,
    onUpdate,
    loadingIds,
  },
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isEditingTodoId, setEditingTodoId] = useState<number | null>(null);

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
    onUpdate?.({ ...todo, title });
    setEditingTodoId(null);
  };

  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();

    if (!title.length) {
      handleDelete();
    } else {
      saveUpdatedTitle();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        {
          'todo completed': todo.completed,
        })}
      onDoubleClick={() => setEditingTodoId?.(todo.id)}
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

      {isEditingTodoId
        ? (
          <form
            onSubmit={onSubmitHandler}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onChange={event => setTitle(event.target.value)}
              onBlur={saveUpdatedTitle}
              // eslint-disable-next-line jsx-a11y/no-autofocus
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
          {
            'is-active': isLoading
          || todo.id === 0 || loadingIds?.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
