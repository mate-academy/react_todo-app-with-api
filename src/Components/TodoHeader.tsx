/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onTodoAdd: (todoTitle: string) => Promise<void>,
  onTodoAddError: (errorMessage: string) => void,
  isAllCompleted: boolean,
  toggleAll: () => void,
  todosLength: number,
  inputFocus: boolean,
};

export const TodoHeader: React.FC<Props> = ({
  onTodoAdd,
  onTodoAddError,
  isAllCompleted,
  toggleAll,
  todosLength,
  inputFocus,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoInput.current?.focus();
  }, [todosLength, inputFocus]);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTodoTitle = todoTitle.trim();

    if (!trimmedTodoTitle) {
      onTodoAddError('Title should not be empty');

      return;
    }

    setIsAdding(true);

    onTodoAdd(trimmedTodoTitle)
      .then(() => {
        setTodoTitle('');
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  return (
    <header className="todoapp__header">
      {Boolean(todosLength) && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          ref={todoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onTitleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
