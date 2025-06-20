import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => Promise<void>;
  onToggleTodoStatus: (todoId: number) => Promise<void>;
  isProcessing: boolean;
  isEditing: boolean;
  setEditingTodoId: (id: number | null) => void;
  onRenameTodo: (id: number, title: string) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onToggleTodoStatus,
  isProcessing,
  isEditing,
  setEditingTodoId,
  onRenameTodo,
}) => {
  const [editingTitle, setEditingTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    if (isProcessing) {
      return;
    }

    onDeleteTodo(todo.id);
  };

  const handleToggle = () => {
    if (isProcessing) {
      return;
    }

    onToggleTodoStatus(todo.id);
  };

  const handleSubmitEdit = async () => {
    await onRenameTodo(todo.id, editingTitle);
  };

  const handleKeyDownEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmitEdit();
    } else if (event.key === 'Escape') {
      setEditingTodoId(null);
      setEditingTitle(todo.title);
    }
  };

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setEditingTitle(todo.title);
    }
  }, [todo.title, isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
          aria-label={`Completed: ${todo.title}`}
          disabled={isProcessing}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingTodoId(todo.id)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
            disabled={isProcessing}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={event => setEditingTitle(event.target.value)}
            onBlur={handleSubmitEdit}
            onKeyDown={handleKeyDownEdit}
            ref={editInputRef}
            disabled={isProcessing}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
