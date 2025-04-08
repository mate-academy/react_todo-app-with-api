import React, { LegacyRef } from 'react';

type Props = {
  onFormSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
  todoTitle: string;
  editField: LegacyRef<HTMLInputElement>;
  setTodoTitle: (ch: string) => void;
  closeEditWithoutChange: (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
};

export const EditForm: React.FC<Props> = ({
  onFormSubmit,
  todoTitle,
  editField,
  setTodoTitle,
  closeEditWithoutChange,
}) => {
  return (
    <form
      onSubmit={event => {
        onFormSubmit(event);
      }}
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={todoTitle}
        ref={editField}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTodoTitle(e.currentTarget.value);
        }}
        onBlur={() => {
          onFormSubmit();
        }}
        onKeyUp={event => {
          closeEditWithoutChange(event);
        }}
      />
    </form>
  );
};
