import React, { useEffect, forwardRef } from 'react';
import { ESCAPE_KEY } from '../constants/appConstants';
import { focusInputField } from '../utils/focus';

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  changeEditing: (editing: boolean) => void;
  didSubmitRef: React.MutableRefObject<boolean>;
  editInputRef: React.RefObject<HTMLInputElement>;
};

export const EditForm = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
      onValueChange,
      onSubmit,
      changeEditing,
      didSubmitRef,
      editInputRef,
    },
    ref,
  ) => {
    useEffect(() => {
      const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === ESCAPE_KEY) {
          changeEditing(false);
        }
      };

      document.addEventListener('keyup', handleKeyUp);

      return () => {
        document.removeEventListener('keyup', handleKeyUp);
      };
    }, [changeEditing]);

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();

      onSubmit();
    };

    const handleBlur = () => {
      if (!didSubmitRef.current) {
        focusInputField(editInputRef);
      }

      onSubmit();
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          data-cy="TodoTitleField"
          type="text"
          ref={ref}
          autoFocus
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={value}
          onChange={e => onValueChange(e.target.value)}
          onBlur={handleBlur}
        />
      </form>
    );
  },
);

EditForm.displayName = 'EditForm';
