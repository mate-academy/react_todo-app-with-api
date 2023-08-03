/* eslint-disable jsx-a11y/no-autofocus */
// #region IMPORTS
import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodoContext';
// #endregion

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { completed, title, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const todosContext = useContext(TodosContext);

  if (!todosContext) {
    return null;
  }

  const {
    removeTodo,
    toggleTodo,
    updateTodoTitle,
    showLoaderFor,
  } = todosContext;

  // #region HANDLINGEVENT
  const handleDeleteTodo = async (todoId: number) => {
    removeTodo(todoId);
  };

  const handleToggleTodo = async (todoId: number) => {
    toggleTodo(todoId);
  };

  function handleEdit() {
    setIsEditing(true);
  }

  function handleEditChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditedTitle(event.target.value);
  }

  function handleEditSubmit() {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle !== '') {
      setEditedTitle(trimmedTitle);
      setIsEditing(false);
      updateTodoTitle(id, trimmedTitle);
    } else {
      removeTodo(id);
    }
  }

  function handleEditCancel() {
    setIsEditing(false);
    setEditedTitle(title);
  }

  function handleKeyUp(event: React.KeyboardEvent) {
    event.preventDefault();
    if (event.key === 'Enter') {
      handleEditSubmit();
    } else if (event.key === 'Escape') {
      handleEditCancel();
    }
  }

  function handleFormSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleEditSubmit();
  }
  // #endregion

  return (
    <div className={cn('todo', { completed })}>
      <div
        className={cn(
          'modal overlay',
          {
            'is-active': showLoaderFor.includes(id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleToggleTodo(id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleEditChange}
            onBlur={handleEditSubmit}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};
