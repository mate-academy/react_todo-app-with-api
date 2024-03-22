/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID, editTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  todos: Todo[];
  deletingId: number | null;
  deleteSingleTodo: (id: number) => void;
  focusInput: () => void;
  setErrorMessage: (message: string) => void;
  setTodos: (todos: Todo[]) => void;
}

export default function TodoItem({
  todo,
  setTodos,
  focusInput,
  todos,
  deletingId,
  deleteSingleTodo,
  setErrorMessage,
}: Props) {
  const { id, title, completed } = todo;
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editing, setEditing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editInputRef.current && editing) {
      editInputRef.current.focus();
    }
  }, [editing]);

  const updateStatus = useCallback(() => {
    const todowithUpdatedStatus = {
      id,
      userId: USER_ID,
      title,
      completed: !completed,
    };

    setUpdatingId(id);
    editTodo(todowithUpdatedStatus)
      .then(updatedOne => {
        const updatedTodos = todos.map(t =>
          t.id === updatedOne.id ? updatedOne : t,
        );

        setTodos(updatedTodos);
        setUpdatingId(null);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingId(null);
      });
  }, [completed, id, title, todos, setTodos, setErrorMessage]);

  const updateTodo = useCallback(async () => {
    setErrorMessage('');
    setUpdatingId(id);

    if (editedTitle === title) {
      setEditing(false);
    }

    try {
      const updatedTodo = await editTodo({
        id,
        userId: USER_ID,
        title: editedTitle.trim(),
        completed,
      });

      if (updatedTodo.title.trim().length < 1) {
        deleteSingleTodo(updatedTodo.id);
        setEditing(false);
        setUpdatingId(null);
        focusInput();
      } else {
        const newTodos = todos.map(t =>
          t.id === updatedTodo.id ? updatedTodo : t,
        );

        setTodos(newTodos);
        setEditing(false);
        setUpdatingId(null);
      }
    } catch (error) {
      setErrorMessage('Unable to edit a todo');
      editInputRef.current?.focus();
      setUpdatingId(null);
    } finally {
      setUpdatingId(null);
    }
  }, [
    id,
    editedTitle,
    completed,
    todos,
    title,
    setTodos,
    deleteSingleTodo,
    focusInput,
    setErrorMessage,
  ]);

  const handleEditFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      updateTodo();
    },
    [updateTodo],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedTitle(e.target.value);
    },
    [],
  );

  const handleDoubleClick = useCallback(() => {
    setEditedTitle(title);
    setEditing(true);
  }, [title]);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setEditing(false);
      }
    },
    [setEditing],
  );

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        updateTodo();
      }
    },
    [updateTodo],
  );

  return (
    <div>
      <div key={id}>
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed,
            editing,
          })}
        >
          <label onClick={updateStatus} className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
            />
          </label>
          {editing ? (
            <form onSubmit={handleEditFormSubmit}>
              <input
                ref={editInputRef}
                onBlur={updateTodo}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeydown}
                data-cy="TodoTitleField"
                type="text"
                value={editedTitle}
                onChange={handleInputChange}
                className="todo__title-field edit "
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
                {title.trim()}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  deleteSingleTodo(id);
                }}
              >
                ×
              </button>
            </>
          )}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': deletingId === id || updatingId === id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      </div>
    </div>
  );
}
