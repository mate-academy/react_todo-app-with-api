import React, { useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  isLoadingTodoIds: number[],
  handleToggleCompleted: (todo: Todo) => Promise<void>,
  handleDeleteTodo: (id: number) => Promise<void>,
  handleUpdateTodo: (todo: Todo) => Promise<void>,

};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoadingTodoIds,
  handleToggleCompleted,
  handleDeleteTodo,
  handleUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleTodoToggle = () => {
    handleToggleCompleted(todo);
  };

  const handleTodoDeletion = () => {
    handleDeleteTodo(todo.id);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTitle.trim() === '') {
      return handleTodoDeletion();
    }

    if (todo.title !== newTitle) {
      handleUpdateTodo({ ...todo, title: newTitle })
        .finally(() => setIsEditing(false));
    }

    return setIsEditing(false);
  };

  const handleEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
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
          onChange={handleTodoToggle}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onKeyUp={(event) => handleEsc(event)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleTodoDeletion}
          >
            ×
          </button>
        </>
      )}

      {(todo.id === 0 || isLoadingTodoIds.includes(todo.id))
      && <Loader />}
    </div>
  );
};
