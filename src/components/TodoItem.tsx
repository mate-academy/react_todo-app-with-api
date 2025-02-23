/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-comment-textnodes */
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types';
import classNames from 'classnames';

type Props = {
  todoItem: Todo;
  onDelete: (id: number) => void;
  isLoading: boolean;
  deletingTodoId: number | null;
  onEdit: (id: number, data: Partial<Todo>) => Promise<void>;
  editingTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todoItem,
  onDelete,
  isLoading,
  deletingTodoId,
  onEdit,
  editingTodoId,
}) => {
  const [editTitle, setEditTitle] = useState('');
  const [currentEditing, setCurrentEditing] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (todo: Todo) => {
    setEditTitle(todo.title);
    setCurrentEditing(todo.id);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleEditBlur = () => {
    if (!editTitle.trim()) {
      try {
        onDelete(todoItem.id);
      } catch (err) {
        setCurrentEditing(todoItem.id);
        inputRef.current?.focus();
      }
    } else if (editTitle !== todoItem.title) {
      onEdit(todoItem.id, { title: editTitle.trim() })
        .then(() => setCurrentEditing(null))
        .catch(() => {
          inputRef.current?.focus();
        });
    } else {
      setCurrentEditing(null);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEditBlur();
    } else if (e.key === 'Escape') {
      setCurrentEditing(null);
      setEditTitle(todoItem.title);
    }
  };

  useEffect(() => {
    if (currentEditing !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentEditing, inputRef]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todoItem.completed,
      })}
      key={todoItem.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() =>
            onEdit(todoItem.id, { completed: !todoItem.completed })
          }
          checked={todoItem.completed}
        />
      </label>
      {currentEditing !== todoItem.id ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleEdit(todoItem)}
          >
            {todoItem.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todoItem.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={e => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={handleEditChange}
            onBlur={handleEditBlur}
            onKeyDown={handleEditKeyDown}
            autoFocus
            ref={inputRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isLoading &&
            [deletingTodoId, editingTodoId, currentEditing].includes(
              todoItem.id,
            ),
        })}
      >
        <div className="modal-background has-background-white-ter" />

        <div className="loader" />
      </div>
    </div>
  );
};
