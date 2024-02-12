import classNames from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    toggleTodo, deleteTodo, deletedIds, editedIds, editTodoTitle,
  } = useContext(TodosContext);
  const { title, completed, id } = todo;

  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleBlur = () => {
    if (!editedTitle.trim()) {
      deleteTodo(id);
    } else if (editedTitle.trim() === title) {
      setEditedTitle(title);
      setEditing(false);
    } else {
      setEditedTitle(editedTitle.trim());
      editTodoTitle(id, {
        ...todo,
        title: editedTitle.trim(),
      });
      setEditing(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(title);
      setEditing(false);
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      handleBlur();
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleToggleTodo = () => {
    toggleTodo(id, todo);
  };

  const handleDeleteTodo = () => {
    deleteTodo(id);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleBlur();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
        editing,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggleTodo}
        />
      </label>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={editedTitle}
            onChange={handleEditChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletedIds.includes(todo.id)
            || editedIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
