import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void,
  loading: boolean,
  onToggleTodoStatus: (tododId: number, completed: boolean) => void,
  onEditTodoTitle: (tododId: number, newTitle: string) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  loading,
  onToggleTodoStatus,
  onEditTodoTitle,
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const titleInputField = useRef<HTMLInputElement>(null);

  const handleDeleteClick = () => {
    onDelete(todo.id);
  };

  const handleToggleTodoStatus = () => {
    onToggleTodoStatus(todo.id, !todo.completed);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleTitleEdit = () => {
    setEditingTitle(true);
    if (!editedTitle) {
      onDelete(todo.id);
    } else if (editedTitle === todo.title) {
      setEditingTitle(false);
    }

    onEditTodoTitle(todo.id, todo.title);
    setEditingTitle(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTitleEdit();
    } else if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setEditingTitle(false);
    }
  };

  useEffect(() => {
    if (editingTitle) {
      titleInputField.current?.focus();
    }
  }, [editedTitle, todo.id]);

  return (
    <li
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          ref={titleInputField}
          onChange={handleToggleTodoStatus}
          disabled={loading}
        />
      </label>

      {!editingTitle ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditingTitle(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteClick}
            disabled={loading}
          >
            ×
          </button>
        </>
      ) : (
        <input
          type="text"
          className="todo__title"
          value={editedTitle}
          ref={titleInputField}
          onKeyUp={handleKeyUp}
          onBlur={handleTitleEdit}
          onChange={handleTitleChange}
        />
      )}

      {loading && (
        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </li>
  );
};
