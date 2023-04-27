/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { ErrorAction } from '../../types/ErrorAction';

type Props = {
  todosCount: number;
  isToggleOnActive: boolean;
  isInputDisabled: boolean;
  setError: (action: ErrorAction) => void;
  addTodo: (title: string) => Promise<void>;
  onToggleAll: () => void;
};

export const TodoInput: React.FC<Props> = React.memo(({
  todosCount,
  isToggleOnActive,
  isInputDisabled,
  setError,
  addTodo,
  onToggleAll,
}) => {
  const [input, setInput] = useState('');
  const [wasTodoAdded, setWasTodoAdded] = useState(false);
  const inputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wasTodoAdded) {
      inputElement.current?.focus();

      setWasTodoAdded(false);
    }
  }, [wasTodoAdded]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const title = input.trim();

      if (title) {
        await addTodo(title);
        setInput('');
        setWasTodoAdded(true);
      } else {
        setError(ErrorAction.EMPTY);
      }
    } catch {
      setError(ErrorAction.LOAD);
    }
  };

  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isToggleOnActive },
          )}
          onClick={onToggleAll}
        />
      )}

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isInputDisabled}
          value={input}
          onChange={event => setInput(event.target.value)}
          ref={inputElement}
        />
      </form>
    </header>
  );
});
