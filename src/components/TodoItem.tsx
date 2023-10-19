import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  deleteTodo:(todo:Todo) => void,
  handleEdit:(todo: Todo) => void;
  onTodoClick: (id: number, completed: boolean) => void;
};

export const TodoItem:React.FC<Props> = ({
  todo,
  deleteTodo,
  isLoading,
  handleEdit,
  onTodoClick,
}) => {
  const [editedText, setEditedText] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const editFocus = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isEditing && editFocus.current) {
      editFocus.current.focus();
    }
  }, [isEditing]);

  const handleEditSubmit = async () => {
    if (!editedText.trim()) {
      deleteTodo(todo);
    } else if (editedText !== todo.title) {
      const updatedTodo = { ...todo, title: editedText };

      setEditedText(updatedTodo.title);
      setIsEditing(false);
      handleEdit(updatedTodo);
    } else {
      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    handleEditSubmit();
  };

  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setEditedText(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onTodoClick(todo.id, todo.completed)}
        />
        <span
          className="todo__status-checkbox"
          onClick={() => onTodoClick(todo.id, todo.completed)}
          aria-hidden="true"
        />
      </label>

      {isEditing ? (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleEditSubmit();
        }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onKeyDown={handleKeyPress}
            ref={editFocus}
            onBlur={handleBlur}
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
            onClick={() => !(isLoading) && deleteTodo(todo)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};
