import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  selectedTodo: Todo | null;
  deleteTodo: (todoId: number) => Promise<void>;
  handleUpdateTitle: (data: Todo) => Promise<boolean | undefined>;
  handleUpdateCompleted: (data: Todo, bool?: boolean) => Promise<Todo>;
}

export const TodoComponent: React.FC<Props> = React.memo(
  ({
    todo,
    loading,
    inputRef,
    selectedTodo,
    deleteTodo,
    handleUpdateTitle,
    handleUpdateCompleted,
  }) => {
    const { id, title, completed } = todo;

    const [editTitle, setEditTitle] = useState(title);
    const [editActive, setEditActive] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    const oldTitle = useRef<string>('');

    useEffect(() => {
      oldTitle.current = editTitle;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isActive =
      loading && (selectedTodo?.id === todo.id || selectedTodo === null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [inputRef, editActive]);

    const handleEdit = useCallback((data: Todo) => {
      setEditActive(true);
      setEditTitle(data.title);
      oldTitle.current = data.title;
    }, []);

    const handleSubmit = useCallback(
      async (e: React.FormEvent | null = null) => {
        e?.preventDefault();

        const trimmedTitle = editTitle.trim();

        if (trimmedTitle !== oldTitle.current.trim()) {
          const success = await handleUpdateTitle({
            ...todo,
            title: trimmedTitle,
          });

          if (success) {
            setEditActive(false);
          }

          return;
        }

        setEditActive(false);
      },
      [editTitle, handleUpdateTitle, todo],
    );

    const handleDelete = useCallback(() => {
      setLocalLoading(true);
      deleteTodo(id).finally(() => {
        setLocalLoading(false);
      });
    }, [deleteTodo, id]);

    const handleUpdate = useCallback(
      async (data: Todo) => {
        setLocalLoading(true);
        await handleUpdateCompleted(data);
        setLocalLoading(false);
      },
      [handleUpdateCompleted],
    );

    const handleEsc = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
          setEditActive(false);
        }
      },
      [],
    );

    return (
      <div data-cy="Todo" className={cn('todo', { completed: completed })}>
        <label className="todo__status-label" aria-label="Toggle todo status">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => handleUpdate(todo)}
            disabled={loading}
          />
        </label>

        {!editActive ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title hidden"
              onDoubleClick={() => handleEdit(todo)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete()}
            >
              ×
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={() => handleSubmit()}
              onKeyUp={e => handleEsc(e)}
              ref={inputRef}
            />
          </form>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isActive || localLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoComponent.displayName = 'TodoComponent';
