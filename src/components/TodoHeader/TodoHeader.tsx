/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { ERRORS } from '../../utils/constants';
import { useTodoContext } from '../../TodoContext';

type Props = {
  addTodo: (newTodoTitle: string) => void;
  newTodoTitle: string;
  setNewTodoTitle: (newTodoTitle: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  addTodo,
  newTodoTitle,
  setNewTodoTitle,
}) => {
  const {
    todoItems,
    setErrorMessage,
    setSingleStatusForAll,
    uncompletedTodosLength,
    isLoading,
    setIsLoading,
    inputLine,
  } = useTodoContext();

  const handleSetStatusForAll = async () => {
    setIsLoading(true);
    try {
      await setSingleStatusForAll();
    } finally {
      setIsLoading(false);
    }
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNewTodoTitle = newTodoTitle.trim();

    if (!trimmedNewTodoTitle) {
      setErrorMessage(ERRORS.TITLE_ERROR);

      return;
    }

    setIsLoading(true);
    try {
      await addTodo(trimmedNewTodoTitle);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all', {
            active: !uncompletedTodosLength,
          },
        )}
        style={{ visibility: todoItems.length ? 'visible' : 'hidden' }}
        data-cy="ToggleAllButton"
        onClick={handleSetStatusForAll}
      />

      <form onSubmit={onFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={onTitleChange}
          disabled={isLoading}
          ref={inputLine}
        />
      </form>
    </header>
  );
};
