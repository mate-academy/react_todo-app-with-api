import React, { useCallback, useEffect, useState } from 'react';
import { ErrorMessage } from '../../types/Errors';

interface Props {
  onSubmit: (title: string) => Promise<boolean>;
  onError: (value: ErrorMessage) => void;
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const AddForm: React.FC<Props> = React.memo(
  ({ onSubmit, onError, disabled = false, inputRef }) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
      if (!disabled && inputRef.current) {
        inputRef.current.focus();
      }
    }, [disabled, inputRef]);

    const submitHandler = useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (disabled) {
          return;
        }

        const normalizedTitle = title.replace(/\s+/g, ' ').trim();

        if (!normalizedTitle) {
          onError(ErrorMessage.Title);

          return;
        }

        const isSuccess = await onSubmit(normalizedTitle);

        if (isSuccess) {
          setTitle('');
        }
      },
      [disabled, onSubmit, onError, title],
    );

    const changeHandler = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        onError(ErrorMessage.None);
      },
      [onError],
    );

    return (
      <form onSubmit={submitHandler}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={changeHandler}
          disabled={disabled}
          aria-disabled={disabled}
        />
      </form>
    );
  },
);

AddForm.displayName = 'AddForm';
