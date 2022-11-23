import React, { FormEvent } from 'react';

type Props = {
  handleAllCompleted: () => void;
  addNewTodo: (event: FormEvent) => Promise<void>;
  newTodoField: React.RefObject<HTMLInputElement>;
  title: string;
  getValue: (element: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TodoForm: React.FC<Props> = ({
  handleAllCompleted,
  addNewTodo,
  newTodoField,
  title,
  getValue,
}) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="close"
        onClick={handleAllCompleted}
      />

      <form onSubmit={addNewTodo}>
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
