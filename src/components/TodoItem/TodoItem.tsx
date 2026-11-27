import classNames from 'classnames';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isPending: boolean;
  onToggle?: (id: number, completed: boolean) => void;
  onDelete?: (id: number) => Promise<boolean>;
  onRename?: (id: number, title: string) => Promise<boolean>;
};

export const TodoItem = ({
  todo,
  isPending,
  onToggle,
  onDelete,
  onRename,
}: Props) => {
  const { id, title, completed } = todo;
  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const saving = useRef(false);
  const isEditing = draft !== null;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  async function saveTitle() {
    if (draft === null || isPending || saving.current) {
      return;
    }

    const newTitle = draft.trim();

    if (draft === title || (newTitle && newTitle === title.trim())) {
      setDraft(null);

      return;
    }

    saving.current = true;

    try {
      const saved = newTitle
        ? await onRename?.(id, newTitle)
        : await onDelete?.(id);

      if (saved) {
        setDraft(null);
      }
    } finally {
      saving.current = false;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void saveTitle();
  }

  function startEditing() {
    if (onRename && !isPending) {
      setDraft(title);
    }
  }

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          aria-label={`Mark ${title} as ${completed ? 'active' : 'completed'}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          disabled={isPending || isEditing}
          onChange={() => onToggle?.(id, !completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            aria-label="Edit todo title"
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty title will delete the todo"
            ref={inputRef}
            value={draft}
            readOnly={isPending}
            onChange={event => setDraft(event.target.value)}
            onBlur={() => void saveTitle()}
            onKeyUp={event => {
              if (event.key === 'Escape' && !isPending) {
                setDraft(null);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
          >
            {title}
          </span>

          <button
            aria-label={`Delete ${title}`}
            data-cy="TodoDelete"
            type="button"
            className="todo__remove"
            disabled={isPending}
            onClick={() => void onDelete?.(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        aria-hidden="true"
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isPending })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
