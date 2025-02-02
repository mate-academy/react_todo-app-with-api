/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';

type Props = {
  todo: Todo;
  handleDeleteTodo: (id: number) => Promise<void>;
  handleUpdateTodo: (todo: Todo) => Promise<void>;
  loadingTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  handleUpdateTodo,
  loadingTodoId,
}) => {
  const { id, title, completed } = todo;
  const [titleText, setTitleText] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveUpdated = () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    const trimmedTitleText = titleText.trim();

    if (!trimmedTitleText) {
      handleDeleteTodo(id)
        .then(() => setIsEditing(false))
        .catch(() => setIsEditing(true))
        .finally(() => setIsSaving(false));
    } else if (trimmedTitleText !== title) {
      handleUpdateTodo({ ...todo, title: trimmedTitleText })
        .then(() => setIsEditing(false))
        .catch(() => setIsEditing(true))
        .finally(() => setIsSaving(false));
    } else {
      setIsEditing(false);
      setIsSaving(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSaveUpdated();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitleText(title);
      setIsEditing(false);
    }
  };

  return (
    <div key={id} data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdateTodo({ ...todo, completed: !completed })}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          autoFocus
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={titleText}
          onBlur={handleSaveUpdated}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onChange={event => setTitleText(event.target.value)}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {title}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(id)}
        >
          ×
        </button>
      )}

      <TodoLoader id={id} loadingTodoId={loadingTodoId} />
    </div>
  );
};
