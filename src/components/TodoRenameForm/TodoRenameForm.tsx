import React, { ChangeEvent, FormEvent, KeyboardEvent } from 'react';

type Props = {
  newTitle: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleInput: (event: ChangeEvent<HTMLInputElement>) => void;
  handleInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleOnBlur: () => void;
};

export const TodoRenameForm: React.FC<Props> = ({
  newTitle, handleInput, handleSubmit, handleInputKeyDown, handleOnBlur,
}) => (
  <form onSubmit={handleSubmit}>
    <input
      data-cy="TodoTitleField"
      type="text"
      className="todo__title-field"
      placeholder="Empty todo will be deleted"
      value={newTitle}
      onChange={handleInput}
      onBlur={handleOnBlur}
      onKeyDown={handleInputKeyDown}
    />
  </form>
);
