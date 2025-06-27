/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { EditForm } from './EditForm';
import { focusInputField } from '../utils/focus';
import cn from 'classnames';

type Props = {
  todo: Todo;
  activeTodoId: number | null;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  activeTodoId,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const didSubmitRef = useRef(false);
  const editInputRef = useRef(null);

  const { completed, id, title } = todo;

  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedTitle(title);
  };

  const handleEditSubmit = () => {
    didSubmitRef.current = true;

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(id).catch(() => {
        setIsEditing(true);
        focusInputField(editInputRef);
        setEditedTitle('');
      });

      return;
    }

    onUpdate({ ...todo, title: trimmedTitle }).then(() => setIsEditing(false));
  };

  const isActive = todo.id === activeTodoId;

  return (
    <div key={id} data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate({ ...todo, completed: !completed })}
        />
      </label>

      {isEditing ? (
        <EditForm
          ref={editInputRef}
          value={editedTitle}
          onValueChange={setEditedTitle}
          onSubmit={handleEditSubmit}
          changeEditing={setIsEditing}
          didSubmitRef={didSubmitRef}
          editInputRef={editInputRef}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleStartEditing}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': isActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
