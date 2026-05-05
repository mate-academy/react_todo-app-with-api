import classNames from 'classnames';
import { Todo as TodoType } from '../../types/Todo';
import React, { useEffect, useRef, useState } from 'react';

const FORM_KEYS = {
  titleInput: 'titleInput',
} as const;

type Props = {
  todo: TodoType;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onToggleCompleted: (id: number) => void;
  onTitleChange: (id: number, newTitle: string) => Promise<void>;
  hasError: boolean;
};

export const Todo: React.FC<Props> = React.memo(
  ({
    todo,
    isLoading,
    onDelete,
    onToggleCompleted,
    onTitleChange,
    hasError,
  }) => {
    const { id, completed, title } = todo;

    // TODO!: Should we provide this flag from the parent too?
    // ! Why draw the line here? Well, I know why, but I want to feel it.
    // ! Also the other way around. If the parent controls batch operations,
    // !  is there any weird architecture that would allow to store all the
    // !  data in the Todos themselves?
    const [isBeingEdited, setIsBeingEdited] = useState(false);
    const inputFieldRef = useRef<HTMLInputElement | null>(null);
    const isBeingEditedRef = useRef(isBeingEdited);

    // #region handlers

    async function handleTitleChange(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      const newTitle = (formData.get(FORM_KEYS.titleInput) as string).trim();

      if (newTitle === title) {
        setIsBeingEdited(false);

        return;
      }

      onTitleChange(id, newTitle);

      // * This is a recommended solution.
      /*
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
      */
    }

    function handleTitleChangeCancel(
      event: React.KeyboardEvent<HTMLFormElement>,
    ) {
      if (event.key === 'Escape') {
        setIsBeingEdited(false);
      }
    }

    // #endregion

    // #region effects

    // TODO! Remind myself why this is an anti-pattern
    // * This is an anti-pattern, although it works.
    /*
      let isFocusingForbidden = false;

      useEffect(() => {
        if (!isLoading && !hasError) {
          setIsBeingEdited(false);
          isFocusingForbidden = true;
        }
      }, [isLoading, hasError]);

      useEffect(() => {
        if (isBeingEdited && !isLoading && !isFocusingForbidden) {
          inputFieldRef.current?.focus();
        }
      }, [isBeingEdited, isLoading]);
    */

    // ? This (both useEffects?) is not recommended because:
    // *  1. Effects are for synchronizing your component with external systems
    // *    when the state changes, not for things that happen because the user
    // *    did something (and input.focus() is exactly an imperative instruction
    // *    for reacting to user's action).
    // *  2. It creates "spaghetti effects".
    // *  That's a strict philosophical dividing line in modern React.
    // *  Effects should only have the change of visual appearance etc.
    useEffect(() => {
      isBeingEditedRef.current = isBeingEdited;

      if (isBeingEdited) {
        inputFieldRef.current?.focus();
      }
    }, [isBeingEdited]);

    useEffect(() => {
      if (!isLoading && !hasError) {
        setIsBeingEdited(false);

        return;
      }

      // Using isBeingEdited here directly is also an anti-pattern,
      //  because the state that useEffect is referring to would be stale, and
      //  although I don't need it to be current -- it's still an anti-pattern.
      if (isBeingEditedRef.current && !isLoading) {
        inputFieldRef.current?.focus();
      }
    }, [isLoading, hasError]);

    // #endregion

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
  },
);

Todo.displayName = 'Todo';
