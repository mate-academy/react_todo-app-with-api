/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { ClientTodo } from '../../types';
import { useTodoItem } from './useTodoItem';

type Props = {
  todo: ClientTodo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    changeTitleInput,
    handleKeyDown,
    handleSave,
    handleToggle,
    isBeingEdited,
    title,
    handleDeleteButtonClick,
    changeTitle,
    handleDoubleClick,
  } = useTodoItem(todo);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSave();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      {isBeingEdited ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={changeTitle}
            ref={changeTitleInput}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            onClick={handleDeleteButtonClick}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': todo.loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
