/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  updateTodoTitle: (todoId: number, newTitle: string) => void;
  updateTodoStatus: (todo: Todo) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  deleteTodo,
  updateTodoTitle,
  updateTodoStatus,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [deletedId, setDeletedId] = useState(0);

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setIsEditing(true);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTitle === todo.title) {
      setIsEditing(false);
      setNewTitle(todo.title);
    } else if (newTitle.trim() === '') {
      setDeletedId(todo.id);
      deleteTodo(todo.id);
    } else {
      updateTodoTitle(todo.id, newTitle);
      setIsEditing(false);
    }
  };

  const handleEsc = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={() => updateTodoStatus(todo)}
        />
      </label>

      {!isEditing
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
              onKeyDown={handleEnter}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )
        : (
          <form
            onSubmit={handleSubmit}
            onBlur={handleSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={newTitle}
              onKeyDown={handleEsc}
              onChange={(event => setNewTitle(event.target.value))}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          { 'is-active': todo.id === deletedId })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
