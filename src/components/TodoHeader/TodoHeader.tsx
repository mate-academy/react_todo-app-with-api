/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

interface Props {
  statusResponce: boolean;
  title: string;
  activeTodosLength: number;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  addTodo: () => void;
  updateAllTodos: () => void;
}

export const TodoHeader: React.FC<Props> = ({
  statusResponce,
  title,
  activeTodosLength,
  setTitle = () => {},
  addTodo = () => {},
  updateAllTodos = () => {},
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [statusResponce]);

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: !activeTodosLength })}
        data-cy="ToggleAllButton"
        onClick={updateAllTodos}
      />

      <form onSubmit={(event) => submitForm(event)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          disabled={statusResponce}
        />
      </form>
    </header>
  );
};
