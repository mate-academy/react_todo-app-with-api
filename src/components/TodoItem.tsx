import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onloadingTodoIds?: number[];
  handleToggleTodo: (id: number) => void;
  handleTodoDelete?: (id: number) => void;
  onEdit?: (currentTodo: Todo) => void;
  errorMessageFromServer?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onloadingTodoIds = [],
  handleToggleTodo = () => {},
  handleTodoDelete = () => {},
  onEdit = () => {},
  errorMessageFromServer,
}) => {
  const isActiveTodoIds = onloadingTodoIds.includes(todo.id) || todo.id === 0;
  const [title, setTitle] = useState(todo.title);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editedTodo && titleField.current) {
      titleField.current.focus();
    }
  }, [editedTodo]);

  const editingTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmitingChange = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    try {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (!title.trim()) {
          await handleTodoDelete(todo.id);

          return;
        } else if (title.trim() === todo.title) {
          setIsEditing(false);

          return;
        } else {
          await onEdit({ ...todo, title });
        }
      }

      if (event.key === 'Escape') {
        if (editedTodo) {
          setTitle(todo.title);
        }
      }
    } catch (error) {
      setEditedTodo(todo);
      setIsEditing(true);
      throw error;
    }
  };

  const handleInputBlur = async () => {
    try {
      if (!title.trim()) {
        await handleTodoDelete(todo.id);
      } else if (title.trim() === todo.title) {
        setIsEditing(false);
        setEditedTodo(null);

        return;
      } else if (editedTodo) {
        await onEdit({ ...todo, title });
      }
    } catch (error) {
      setEditedTodo(todo);
      setIsEditing(false);
    }
  };

  const editSuccess = () => {
    setEditedTodo(null);
    setIsEditing(false);
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    await handleSubmitingChange(event);

    if (
      (event.key === 'Enter' || event.key === 'Escape') &&
      !errorMessageFromServer
    ) {
      editSuccess();
    }
  };

  const handleBlur = async () => {
    await handleInputBlur();

    if (!errorMessageFromServer) {
      editSuccess();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onBlur={handleBlur}
      onDoubleClick={() => {
        setEditedTodo(todo);
        setIsEditing(true);
      }}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleTodo(todo.id)}
        />
      </label>

      {editedTodo && isEditing ? (
        <form>
          <input
            ref={titleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={editingTitle}
            onKeyDown={handleKeyPress}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title.trim()}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActiveTodoIds,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
