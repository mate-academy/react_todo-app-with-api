/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import * as todosService from '../api/todos';

type Props = {
  todo: Todo;
  loading: boolean;
  onToggle: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  setSelectedTodo: (todoId: number) => void;
  onEditTodo: (id: number, title: string) => void;
  onLoading: (is: boolean) => void;
  onError: (message: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onToggle,
  onDeleteTodo,
  setSelectedTodo,
  onEditTodo,
  onLoading,
  onError,
}) => {
  const { title, completed, id } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isSaving, setIsSaving] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (isSaving) {
      return;
    }

    setIsSaving(true);
    onLoading(true);
    setSelectedTodo(id);

    try {
      if (trimmedTitle === '') {
        await todosService.deleteTodo(id);
        onDeleteTodo(id);
      } else {
        await todosService.patchTodo(id, { title: trimmedTitle });
        onEditTodo(id, trimmedTitle);
        setNewTitle(trimmedTitle);
      }

      setIsEditing(false);
    } catch {
      onError(
        trimmedTitle === ''
          ? 'Unable to delete a todo'
          : 'Unable to update a todo',
      );
      setIsEditing(true);
    } finally {
      setIsSaving(false);
      onLoading(false);
      setSelectedTodo(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title); // Відкат змін
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          id={id.toString()}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            onToggle(id);
            setSelectedTodo(id);
          }}
          disabled={loading || isSaving}
        />
        <span className="hidden" style={{ display: 'none' }}>
          *
        </span>
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            ref={renameInputRef}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setSelectedTodo(id);
              onDeleteTodo(id);
            }}
            disabled={loading || isSaving}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loading || isSaving,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
