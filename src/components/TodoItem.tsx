import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  deleteTodos: (todoId: number) => void;
  isLoading: boolean;
  updatePost: (todoToUpdate: Todo) => Promise<void>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodos,
  isLoading = false,
  updatePost,
  inputRef,
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const { id, completed, title } = todo;
  const [newTitle, setNewTitle] = useState<string>(title);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [editing, inputRef]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNewTitle(title);
        setEditing(false);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [title]);

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  const handleEditTitle = () => {
    setEditing(true);
    setNewTitle(title);
  };

  const handleRenameTodo = async () => {
    const trimmedEditedTitle = newTitle.trim();

    if (trimmedEditedTitle === title) {
      setEditing(false);

      return;
    }

    if (!trimmedEditedTitle) {
      try {
        deleteTodos(id);
      } catch (error) {}

      return;
    }

    try {
      await updatePost({
        ...todo,
        title: trimmedEditedTitle,
      });
      setEditing(false);
    } catch (error) {
      setEditing(true);
    }
  };

  const onSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    handleRenameTodo();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      onDoubleClick={handleEditTitle}
    >
      <label htmlFor={`todo-${id}`} className="todo__status-label">
        {''}
        <input
          id={`todo-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updatePost({ ...todo, completed: !completed })}
        />
      </label>
      {editing ? (
        <form onSubmit={onSubmitForm}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleRenameTodo}
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
            onClick={() => deleteTodos(id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
