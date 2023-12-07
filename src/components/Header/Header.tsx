import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

import { USER_ID } from '../../helpers/userId';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  todoTitle: string,
  setTodoTitle: (value: string) => void
  onSubmit: ({ userId, title, completed }: Todo) => void,
  onToggleAll: () => void,
  response: boolean,
  setErrorMessage: (value: string) => void,
};

export const Header: React.FC<Props> = ({
  onSubmit,
  onToggleAll,
  todos,
  todoTitle,
  setTodoTitle,
  response,
  setErrorMessage,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length, response]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage('');

    onSubmit({
      id: 0,
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    });
  };

  const todosExists = todos.length > 0;
  const isActive = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todosExists && (
        /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isActive,
          })}
          data-cy="ToggleAllButton"
          disabled={response}
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={todoTitle}
          disabled={response}
          onChange={(event) => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
