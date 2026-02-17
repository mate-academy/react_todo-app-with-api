import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  onAdd: (title: string) => Promise<boolean>;
  disabled: boolean;
  todos: Todo[];
  onToggleAll: () => void;
};

export type HeaderRef = { focus: () => void };

export const Header = forwardRef<HeaderRef, Props>(
  ({ onAdd, disabled, todos, onToggleAll }, ref) => {
    const [title, setTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (await onAdd(title)) {
        setTitle('');
      }
    };

    const isAllCompleted = todos.length > 0 && todos.every(t => t.completed);

    return (
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isAllCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={onToggleAll}
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={disabled}
            data-cy="NewTodoField"
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
