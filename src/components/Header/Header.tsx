/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, RefObject, useState, ChangeEvent, FormEvent, useCallback, memo,
} from 'react';
import cn from 'classnames';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  isAdding: boolean;
  addTodoToServer: (todoTitle: string) => Promise<void>;
  errorChange: () => void;
  ErrorNotification: (str: string) => void;
  isTodos: number;
  isActiveToggleAll: boolean;
  handleToggleAll: () => Promise<void>;
};

export const Header: FC<Props> = memo(({
  newTodoField,
  isAdding,
  addTodoToServer,
  errorChange,
  ErrorNotification,
  isTodos,
  isActiveToggleAll,
  handleToggleAll,
}) => {
  const [title, setTitle] = useState('');

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }, []);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      errorChange();
      ErrorNotification('Title can\'t be empty');

      return;
    }

    addTodoToServer(title);
    setTitle('');
  },
  [addTodoToServer, errorChange, ErrorNotification, addTodoToServer, title]);

  return (
    <header className="todoapp__header">
      {isTodos > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={cn(
            'todoapp__toggle-all',
            {
              active: isActiveToggleAll,
            },
          )}
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInput}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
