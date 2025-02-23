import classNames from 'classnames';
import { forwardRef, MutableRefObject, useEffect, useState } from 'react';
import { ErrorMessages, Todo } from '../types';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onAdd: (title: string) => void;
  onError: (message: ErrorMessages) => void;
  isError: boolean;
  isLoading: boolean;
  isAllCompleted: boolean;
  onToggleAll: () => void;
};

// eslint-disable-next-line react/display-name
export const Header = forwardRef<HTMLInputElement, Props>(
  (
    {
      todos,
      tempTodo,
      onAdd,
      onError,
      isError,
      isLoading,
      isAllCompleted,
      onToggleAll,
    },
    inputRef,
  ) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
      if (inputRef && !tempTodo) {
        (inputRef as MutableRefObject<HTMLInputElement>).current.focus();
      }
    }, [tempTodo, inputRef]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedTitle = title.trim();

      if (trimmedTitle === '') {
        onError(ErrorMessages.EMPTY_TITLE);
        setTimeout(() => onError(ErrorMessages.DEFAULT), 3000);

        return;
      }

      onAdd(trimmedTitle);
    };

    useEffect(() => {
      if (!isLoading && !isError) {
        setTitle('');
      }
    }, [isLoading, isError]);

    return (
      <header className="todoapp__header">
        {!isLoading && todos.length > 0 && (
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
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </form>
      </header>
    );
  },
);
