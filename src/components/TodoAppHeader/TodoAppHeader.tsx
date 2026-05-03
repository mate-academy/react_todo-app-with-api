import React, { useCallback, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import classNames from 'classnames';
type Props = {
  todos: Todo[];
  includesFalseCompleted: boolean;
  loaderClearButton: boolean;
  loaderDeleteButton: boolean;
  errorPostTodo: boolean;
  loadingPostTodo: boolean;
  title: string;
  setTitle: (title: string) => void;
  setNotificationError: (error: boolean) => void;
  setTempTodo: (todo: Todo) => void;
  setErrorTitle: (error: boolean) => void;
  onClickToggleAll: (click: boolean) => void;
};

export const TodoAppHeader = React.memo<Props>(
  ({
    todos,
    includesFalseCompleted,
    loaderClearButton,
    loaderDeleteButton,
    errorPostTodo,
    loadingPostTodo,
    title,
    setTitle,
    setNotificationError,
    setTempTodo,
    setErrorTitle,
    onClickToggleAll,
  }) => {
    const titleField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (titleField.current && !loaderDeleteButton) {
        titleField.current.focus();
      }

      if (!loadingPostTodo && !errorPostTodo && !loaderClearButton) {
        setTitle('');
      }
    }, [loadingPostTodo, loaderDeleteButton, loaderClearButton]);

    const inputTitle = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
      },
      [],
    );

    const inputOnKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          if (!title.trim()) {
            setNotificationError(true);
            setErrorTitle(true);
            setTimeout(() => {
              setErrorTitle(false);
            }, 3000);
          } else {
            setTempTodo({
              id: 0,
              userId: USER_ID,
              title: title.trim(),
              completed: false,
            });
          }
        }
      },
      [title],
    );

    return (
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: includesFalseCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={() => {
              onClickToggleAll(true);
            }}
          />
        )}

        {/* Add a todo on form submit */}
        <form>
          <input
            value={title}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onChange={inputTitle}
            onKeyDown={inputOnKeyDown}
            ref={titleField}
            disabled={loadingPostTodo}
          />
        </form>
      </header>
    );
  },
);

TodoAppHeader.displayName = 'TodoAppHeader';
