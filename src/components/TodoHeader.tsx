import React, { RefObject } from 'react';

type Props = {
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string,
  isSubmiting: boolean,
  inputRef: RefObject<HTMLInputElement>;
  toggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  handleFormSubmit,
  handleChangeInput,
  title,
  isSubmiting,
  inputRef,
  toggleAll,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle"
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
        onClick={toggleAll}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputRef}
          disabled={isSubmiting}
          data-cy="NewTodoField"
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChangeInput}
        />
      </form>
    </header>
  );
};
