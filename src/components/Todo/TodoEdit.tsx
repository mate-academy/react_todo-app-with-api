import React, { useState } from 'react';

export interface TodoEditFormData {
  title: string;
}

type Props = {
  title: string;
  onSubmit: (values: TodoEditFormData) => void;
  onCansel: () => void;
};

export const TodoEdit: React.FC<Props> = ({ title, onCansel, onSubmit }) => {
  const [value, setValue] = useState(title);

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      onCansel();
    }
  }

  function saveChanges() {
    const valueTrimmed = value.trim();

    if (valueTrimmed === title) {
      onCansel();

      return;
    }

    onSubmit({ title: valueTrimmed });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveChanges();
  }

  function handleBlur() {
    saveChanges();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={value}
        onChange={event => setValue(event.target.value)}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        autoFocus
      />
    </form>
  );
};
