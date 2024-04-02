/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  onloadingTodoIds?: number[];
  onEdit?: (currentTodo: Todo) => void;
  isEditingTodo?: boolean;
  setIsEditingTodo?: (isEditing: boolean) => void;
  onChecked?: (currentTodo: Todo) => void;
  errorFromServer?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onloadingTodoIds = [],
  onDelete = () => {},
  onEdit = () => {},
  isEditingTodo,
  setIsEditingTodo = () => {},
  onChecked = () => {},
  errorFromServer,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editedTodo && titleField.current) {
      return titleField.current.focus();
    }
  }, [editedTodo]);

  const editTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmitChanges = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    try {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (!title.trim()) {
          await onDelete(todo.id);

          return;
        } else if (title.trim() === todo.title) {
          setIsEditingTodo(false);

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
      setIsEditingTodo(true);
      throw error;
    }
  };

  const handleInputBlur = async () => {
    try {
      if (!title.trim()) {
        await onDelete(todo.id);
      } else if (title.trim() === todo.title) {
        setIsEditingTodo(false);
        setEditedTodo(null);

        return;
      } else if (editedTodo) {
        await onEdit({ ...todo, title });
      }
    } catch (error) {
      setEditedTodo(todo);
      setIsEditingTodo(true);
    }
  };

  const handleEditSuccess = () => {
    setEditedTodo(null);
    setIsEditingTodo(false);
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    await handleSubmitChanges(event);

    if ((event.key === 'Enter' || event.key === 'Escape') && !errorFromServer) {
      handleEditSuccess();
    }
  };

  const handleBlur = async () => {
    await handleInputBlur();

    if (!errorFromServer) {
      handleEditSuccess();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo ', {
        completed: todo.completed,
      })}
      onDoubleClick={() => {
        setEditedTodo(todo);
        setIsEditingTodo(true);
      }}
      onBlur={handleBlur}
    >
      <label className="todo__status-label">
        <input
          checked={todo.completed}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onChecked(todo)}
        />
      </label>

      {editedTodo && isEditingTodo ? (
        <form>
          <input
            ref={titleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={editTitle}
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
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay ', {
          'is-active': onloadingTodoIds.includes(todo.id) || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
