/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useRef, useEffect } from 'react';

type Props = {
  isAdding: boolean,
  addNewTodo: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  title: string,
  setTitle: (title: string) => void,
  onToggleAll: () => {},
  allCompleted: boolean,
};

export const ListHeader: React.FC<Props> = ({
  isAdding, addNewTodo, title, setTitle, onToggleAll, allCompleted,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

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
        className={classNames('todoapp__toggle-all',
          { active: allCompleted })}
        onClick={onToggleAll}
      />

      <form onSubmit={addNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
