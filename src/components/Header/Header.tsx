import React, { FormEvent, useEffect } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  handleAddTodo: (event: FormEvent) => void;
  handleAllCompleted: () => void;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  setTitle,
  title,
  handleAddTodo,
  handleAllCompleted,
}) => {
  const getValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="close"
        onClick={handleAllCompleted}
      />

      <form
        onSubmit={handleAddTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={getValue}
        />
      </form>
    </header>
  );
};
