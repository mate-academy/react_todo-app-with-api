import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { ErrorMessage, Todo } from '../../types';
import { USER_ID } from '../../api/todos';

type Props = {
  onAdd: (todo: Todo) => void,
  onToggleAll: (completed: boolean) => void,
  onError: (message: ErrorMessage) => void,
  hasActive: boolean,
  creating: boolean
};

export const Header: React.FC<Props> = React.memo(
  ({
    onAdd,
    onError,
    creating,
    hasActive,
    onToggleAll,
  }) => {
    const [todoTitle, setTodoTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!creating) {
        setTodoTitle('');
        inputRef.current?.focus();
      }
    }, [creating]);

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();

      if (!todoTitle) {
        onError(ErrorMessage.TITLE);

        return;
      }

      const newTodo = {
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      onAdd(newTodo);
    };

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: !hasActive },
          )}
          onClick={() => onToggleAll(!hasActive)}
        />

        <form
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={({ target }) => setTodoTitle(target.value)}
            disabled={creating}
          />
        </form>
      </header>
    );
  },
);
