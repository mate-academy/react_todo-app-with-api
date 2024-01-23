import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  onSubmit: (title: string) => Promise<void>;
  error: string;
  setError: (er: string) => void;
  isListLoading: boolean;
  setIsListLoading: (value: boolean) => void;
  toggleAll: (value: boolean) => void;
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header: React.FC<Props> = React.memo(({
  todos,
  onSubmit,
  error,
  setError,
  isListLoading,
  setIsListLoading,
  toggleAll,
}) => {
  const allCompleted = useMemo(() => todos
    .every(todo => todo.completed), [todos]);

  const [title, setTitle] = useState('');
  const [toggle, setToggle] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isListLoading]);

  useEffect(() => {
    setToggle(allCompleted);
  }, [allCompleted]);

  const reset = () => {
    setTitle('');
    setError('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(ErrorMessage.EmptyTitle);
      setTitle('');
    } else {
      setIsListLoading(true);

      onSubmit(title.trim())
        .then(() => {
          if (!error) {
            reset();
          }
        })
        .finally(() => setIsListLoading(false));
    }
  };

  const handleTitleChage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleToggleAll = () => {
    setToggle(!toggle);
    toggleAll(!toggle);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: allCompleted })}
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
          disabled={isListLoading}
        />
      </form>
    </header>
  );
});
