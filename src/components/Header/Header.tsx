import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

type Props = {
  isActiveTodos: boolean;
  title: string;
  newTodo: (event: React.FormEvent) => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  changeAllStatus: () => void;
};

export const Header: React.FC<Props> = ({
  isActiveTodos,
  title,
  newTodo,
  setTitle,
  changeAllStatus,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const getValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="active"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActiveTodos },
        )}
        onClick={changeAllStatus}
      />

      <form
        onSubmit={newTodo}
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
