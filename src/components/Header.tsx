import classnames from 'classnames';
import React, { FormEvent } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  addNewTodo: (event: FormEvent) => Promise<void>,
  title: string,
  setTitle: (param: string) => void,
  handleToggleAll: () => void,
  todoActive: Todo[],
};

export const Header: React.FC<Props> = ({
  addNewTodo,
  title,
  setTitle,
  handleToggleAll,
  todoActive,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        aria-label="button"
        className={classnames(
          'todoapp__toggle-all', {
            active: todoActive.length === 0,
          },
        )}
        onClick={() => {
          handleToggleAll();
        }}
      />
      <form
        onSubmit={addNewTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
