import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  onSubmit: (title: string) => Promise<void>;
  error: string;
  setError: (er: string) => void;
  loading: boolean;
  toggleAll: (value: boolean) => void;
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header: React.FC<Props> = ({
  todos,
  onSubmit,
  error,
  setError,
  loading,
  toggleAll,
}) => {
  const [title, setTitle] = useState('');
  const [toggle, setToggle] = useState(false);
  const [isProcesing, setIsProcesing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isProcesing]);

  const reset = () => {
    setTitle('');
    setError('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcesing(true);

    if (!title.trim()) {
      setError(ErrorMessage.EmptyTitle);
      setTitle('');

      return;
    }

    onSubmit(title.trim())
      .then(() => {
        if (!error) {
          reset();
        }
      })
      .finally(() => setIsProcesing(false));
  };

  const handleTitleChage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleToggleAll = () => {
    toggleAll(toggle);
    setToggle(!toggle);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: todos.every(todo => todo.completed) })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={handleTitleChage}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          disabled={loading}
        />
      </form>
    </header>
  );
};
