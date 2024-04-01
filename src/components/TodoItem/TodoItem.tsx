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
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onloadingTodoIds = [],
  onDelete = () => {},
  onEdit = () => {},
  isEditingTodo,
  setIsEditingTodo = () => {},
  onChecked = () => {},
}) => {
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTodo && editedTodo && titleField.current) {
      return titleField.current.focus();
    }
  }, [isEditingTodo, editedTodo]);

  const editTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const toggleChecked = async () => {
    try {
      onChecked({ ...todo, completed: !completed });
      setCompleted(!completed);
    } catch {
      setCompleted(completed);
    }
  };

  const handleSubmitChanges = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!title.trim()) {
        onDelete(todo.id);

        return;
      } else {
        onEdit({ ...todo, title });
      }

      setEditedTodo(null);
      setIsEditingTodo(false);
    }

    if (event.key === 'Escape') {
      if (editedTodo) {
        setTitle(editedTodo.title);
        setEditedTodo(null);
      }

      setIsEditingTodo(false);
    }
  };

  const handleInputBlur = () => {
    if (!title.trim()) {
      onDelete(todo.id);

      return;
    } else {
      onEdit({ ...todo, title });
    }

    setEditedTodo(null);
    setIsEditingTodo(false);
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
      onBlur={handleInputBlur}
    >
      <label className="todo__status-label">
        <input
          checked={completed}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={toggleChecked}
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
            onKeyDown={handleSubmitChanges}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
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
