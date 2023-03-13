import React, { FormEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  title: string;
  todos: Todo[];
  onAdd: () => void;
  toggleAll: () => void;
  isTodoAdding: boolean;
  isToggleAllActive: boolean;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
};

export const Header: React.FC<Props> = ({
  title,
  todos,
  onAdd,
  setTitle,
  toggleAll,
  setErrorType,
  isTodoAdding,
  isToggleAllActive,
}) => {
  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorType('empty title');

      return;
    }

    onAdd();
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          aria-label="toggle all todos statuses"
          className={classNames('todoapp__toggle-all', {
            active: isToggleAllActive,
          })}
          onClick={toggleAll}
        />
      )}
      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          disabled={isTodoAdding}
        />
      </form>

    </header>
  );
};
