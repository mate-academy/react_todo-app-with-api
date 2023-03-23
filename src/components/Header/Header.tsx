/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  addTodo: (title: string) => void;
  isInputActive: boolean;
  hasActive: boolean;
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  addTodo,
  isInputActive,
  hasActive,
  toggleAll,
}) => {
  const [title, setTitle] = useState('');
  const todoInput = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(title);
    setTitle('');
  };

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  }, [isInputActive]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !hasActive },
        )}
        onClick={toggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={todoInput}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={!isInputActive}
        />
      </form>
    </header>
  );
};
