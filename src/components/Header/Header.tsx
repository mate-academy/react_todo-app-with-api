import classNames from 'classnames';
import React, { FormEventHandler, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  title: string,
  setTitle: (param: string) => void,
  handleSubmit: FormEventHandler<HTMLFormElement>,
  toggleAll: boolean,
  handleToggleAll: () => void,
  todos: Todo[],
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  handleSubmit,
  toggleAll,
  handleToggleAll,
  todos,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: toggleAll },
          )}
          aria-label="toggle"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitle}
        />
      </form>
    </header>
  );
};
