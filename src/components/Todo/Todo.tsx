import classNames from 'classnames';
import { Todo as TodoType } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';

const FORM_KEYS = {
  titleInput: 'titleInput',
} as const;

type Props = {
  todo: TodoType;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onToggleCompleted: (id: number) => void;
  onTitleChange: (id: number, newTitle: string) => Promise<void>;
};

export const Todo: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggleCompleted,
  onTitleChange,
}) => {
  const { id, completed, title } = todo;

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const inputFieldRef = useRef<HTMLInputElement | null>(null);

  async function handleTitleChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // ? Is pre-trimming ok?
    const newTitle = (formData.get(FORM_KEYS.titleInput) as string).trim();

    // * Currently we don't need any actions for this case, so it's
    // *  simpler to perform this check here.
    if (newTitle === title) {
      setIsBeingEdited(false);

      return;
    }

    try {
      await onTitleChange(id, newTitle);

      setIsBeingEdited(false);
    } catch (error) {
      // This wouldn't focus if the element was disabled.
      //  It would require e.g. a useEffect.
      // ! When a next request is sent while the first one didn't yet receive
      // !  a response -- it creates a loop of sending requests for each of the
      // !  failed requests, until the user interrupts it by e.g. focusing in
      // !  another window.
      inputFieldRef.current?.focus();
    }
  }

  function handleTitleChangeCancel(
    event: React.KeyboardEvent<HTMLFormElement>,
  ) {
    if (event.key === 'Escape') {
      setIsBeingEdited(false);
    }
  }

  useEffect(() => {
    if (isBeingEdited) {
      inputFieldRef.current?.focus();
    }
  }, [isBeingEdited]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          // Keyboard also triggers onClick. No selection highlight.
          onChange={() => onToggleCompleted(id)}
        />
      </label>

      {isBeingEdited ? (
        <form
          onSubmit={handleTitleChange}
          onBlur={handleTitleChange}
          onKeyUp={handleTitleChangeCancel}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            name={FORM_KEYS.titleInput}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={title}
            ref={inputFieldRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsBeingEdited(true)}
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
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
