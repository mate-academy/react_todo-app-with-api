import cn from 'classnames';
import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoErrors } from '../../types/Errors';

type Props = {
  todo: Todo,
  onDeleteTodo: (todoId: number) => Promise<any>,
  isDeleting: boolean;
  onUpdateTodo: (todo: Todo) => Promise<any>,
  isUpdating: boolean,
  showError: (message: string) => void,
  updateTodoTitle: (todo: Todo) => void,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDeleteTodo,
  isDeleting,
  onUpdateTodo,
  isUpdating,
  showError,
  updateTodoTitle,
}) => {
  const isLoading = todo.id === 0 || isDeleting || isUpdating;
  const { id, title, completed } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const newTitleField = useRef<HTMLInputElement>(null);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTitle === title) {
      setIsEditing(false);
    }

    if (newTitle === '') {
      onDeleteTodo(todo.id);

      return;
    }

    try {
      await updateTodoTitle({
        ...todo,
        title: newTitle,
      });
    } catch {
      showError(TodoErrors.UnableToaupdateTdo);
    }

    setIsEditing(false);
  };

  useEffect(() => {
    if (newTitleField.current) {
      newTitleField.current.focus();
    }
  }, [isEditing]);

  const cancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && isEditing) {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => onUpdateTodo({
            ...todo,
            completed: !completed,
          })}
        />
      </label>
      {isEditing
        ? (
          <form
            onSubmit={handleFormSubmit}
            onBlur={handleFormSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTitleField}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue="JS"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onKeyDown={cancelEditing}
            />
          </form>
        )
        : (
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
              data-cy="TodoDeleteButton"
              onClick={() => onDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
