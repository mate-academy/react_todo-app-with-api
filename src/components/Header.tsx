import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Error } from '../types/Error';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  addTodo: (title: string) => Promise<void>,
  error: string,
  setError: (er: string) => void,
  loading: boolean,
  allCompleted: boolean,
  toggleAll: (value: boolean) => void,
  setLoading: (value: boolean) => void,
};

export const Header: React.FC<Props> = React.memo(({
  addTodo,
  error,
  setError,
  loading,
  todos,
  allCompleted,
  toggleAll,
  setLoading,
}) => {
  const [title, setTitle] = useState('');
  const [toggle, setToggle] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    setToggle(allCompleted);
  }, [allCompleted]);

  const reset = () => {
    setTitle('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError(Error.submit);
      setTitle('');
    } else {
      setLoading(true);

      addTodo(title.trim())
      .then(() => {
        if (!error) {
          reset();
        }
      })
      .finally(() => {
        setLoading(false);
      });
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
          aria-label="toggleButton"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
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
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
          ref={inputRef}
          value={title}
          disabled={loading}
        />
      </form>
    </header>
  );
});
