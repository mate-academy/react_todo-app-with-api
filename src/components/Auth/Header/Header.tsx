import classNames from 'classnames';
import React, { FormEvent, useEffect, useRef } from 'react';
import { Todo } from '../../../types/Todo';

type Props = {
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  handleSubmit: (event: FormEvent) => Promise<void>,
  todos: Todo[];
  title: string;
  isAdding: boolean;
  handleToggleAll: () => Promise<void>,
};

export const Header: React.FC<Props> = ({
  setTitle,
  handleSubmit,
  todos,
  title,
  isAdding,
  handleToggleAll,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const getValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="close"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.every(todo => todo.completed) },
        )}
        onClick={handleToggleAll}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={getValue}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
