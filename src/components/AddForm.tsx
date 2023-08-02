import React from 'react';
import { ErrorType } from '../types/Error';

type Props = {
  onSubmit: (title: string) => {},
  title: string,
  onHandleTitleChange: (title: string) => void,
  onHandleSubmitError: (error: ErrorType) => void,
};

export const AddForm: React.FC<Props> = ({
  onSubmit,
  title,
  onHandleTitleChange,
  onHandleSubmitError,
}) => {
  const handleTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onHandleTitleChange(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim().length < 1) {
      onHandleSubmitError(ErrorType.emptyValue);

      return Promise.reject();
    }

    if (title.trim().length > 1) {
      await onSubmit(title);
      onHandleTitleChange('');
    }

    return Promise.resolve();
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleTitleChange}
      />
    </form>
  );
};
