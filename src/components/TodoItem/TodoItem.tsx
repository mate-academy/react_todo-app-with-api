import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

interface TodoItemProps {
  todo: Todo;
  onDeleteClick?: () => void;
  loading?: boolean;
  onUpdateCompleted?: (e: React.MouseEvent) => void;
  updateTodoTitle?: (id: number, newTitle: string) => void;

}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  onDeleteClick,
  onUpdateCompleted,
  updateTodoTitle,
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (
      editedTitle === title
      || !updateTodoTitle
      || !id
    ) {
      return;
    }

    updateTodoTitle(id, editedTitle);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (
        editedTitle === title
        || !updateTodoTitle
        || !id
      ) {
        return;
      }

      updateTodoTitle(id, editedTitle);
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      key={id}
    >
      <label
        htmlFor={`todo-checkbox-${id}`}
        className="todo__status-label"
      >
        <input
          onClick={onUpdateCompleted}
          id={`todo-checkbox-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status onDoubleClick"
          checked={completed}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            className="todo__title-field"
            type="text"
            value={editedTitle}
            onKeyDown={handleKeyPress}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleBlur}
            placeholder="Empty todo will be deleted"
          />
        </form>
      ) : (

        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDeleteClick}
          >
            ×
          </button>
        </>
      )}

      <TodoLoader loading={loading} />
    </div>
  );
};
