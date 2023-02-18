import React, {
  ChangeEvent,
  FormEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';

type Props = {
  hasActive: boolean,
  isCreating: boolean,
  isToggleButtonVisible: boolean,
  onToggleAll: () => void,
  onAdd: (title: string) => void,
};

export const Header: React.FC<Props> = React.memo(
  ({
    onAdd,
    isCreating,
    hasActive,
    onToggleAll,
    isToggleButtonVisible,
  }) => {
    const [todoTitle, setTodoTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!isCreating) {
        setTodoTitle('');
        inputRef.current?.focus();
      }
    }, [isCreating]);

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();

      onAdd(todoTitle);
    };

    const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      setTodoTitle(event.target.value);
    }, []);

    return (
      <header className="todoapp__header">
        {isToggleButtonVisible && (
          <button
            aria-label="Toggle all todos"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: !hasActive },
            )}
            onClick={() => onToggleAll()}
          />
        )}

        <form
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={handleInput}
            disabled={isCreating}
          />
        </form>
      </header>
    );
  },
);
