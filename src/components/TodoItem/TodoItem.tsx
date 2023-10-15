import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodos } from '../Context';

export const TodoItem: React.FC<Todo> = (todo: Todo) => {
  const {
    deleteTodo,
    loadingTodoId,
    completTodo,
    isLoading,
    isEditing,
    setIsEditingId,
    editTitle,
    headerInputRef,
  } = useTodos();

  const [editedTitle, setEditedTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { completed, id, title } = todo;

  const isLoadingId = id === loadingTodoId;
  const isLoadingComplete = isLoading === true && completed === true;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleInputBlur = () => {
    if (editedTitle.trim() === '') {
      deleteTodo(id);
    } else {
      editTitle({ ...todo, title: editedTitle.trim() });
      setIsEditingId(null);

      if (headerInputRef.current) {
        headerInputRef.current.focus();
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        handleInputBlur();

        break;

      case 'Escape':
        setEditedTitle(title);
        setIsEditingId(null);

        break;

      default: break;
    }
  };

  const handleFocusClick = () => {
    editTitle(todo);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames({
        todo: true,
        completed,
        editing: isEditing,
      })}
      onDoubleClick={handleFocusClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => completTodo(todo)}
          defaultChecked={completed}
        />
      </label>

      {isEditing !== id ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      ) : (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          ref={inputRef}
          value={editedTitle}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
      )}

      <div data-cy="TodoLoader" className={`modal overlay ${(isLoadingId || isLoadingComplete) && 'is-active'}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
