/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  title: string,
  setTitle: (value: string) => void;
  onHandleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  response: boolean;
  toggleAll: () => void;
};

export const Header: FC<Props> = ({
  todos,
  title,
  setTitle,
  onHandleSubmit,
  response,
  toggleAll,
}) => {
  const inputField = useRef<HTMLInputElement>(null);
  const allTodosCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [response, todos.length]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          onClick={toggleAll}
        />
      )}

      <form
        method="POST"
        onSubmit={onHandleSubmit}
      >
        <input
          data-cy="NewTodoField"
          ref={inputField}
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={response}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
