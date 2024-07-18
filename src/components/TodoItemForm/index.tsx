import React, { FormEvent, useState } from 'react';

type Props = {
  title: string;
  inputChangeField: React.RefObject<HTMLInputElement>;
  onSubmit: (val: string) => void;
};

export const TodoItemForm: React.FC<Props> = ({
  title,
  onSubmit,
  inputChangeField,
}) => {
  const [inputValue, setInputValue] = useState(title);

  const handleTodoSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <form onSubmit={handleTodoSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        onChange={e => setInputValue(e.target.value)}
        value={inputValue}
        ref={inputChangeField}
        onBlur={() => onSubmit(inputValue)}
      />
    </form>
  );
};
