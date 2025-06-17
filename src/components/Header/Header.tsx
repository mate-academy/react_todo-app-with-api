import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { ErrorNotificationMessage } from '../../types/ErrorNotificationMessage';

interface HeaderProps {
  isLoadingTodos: boolean;
  isActive: boolean;
  newTitle: string;
  todosLength: number;
  onChangeNewTitle: (newTitle: string) => void;
  addTodo: ({ title, completed, userId }: Omit<Todo, 'id'>) => Promise<void>;
  onErrorMessage: (errorMessage: ErrorNotificationMessage) => void;
  onChangeAllTodos: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoadingTodos,
  isActive,
  newTitle,
  todosLength,
  onChangeNewTitle,
  addTodo,
  onErrorMessage,
  onChangeAllTodos,
}) => {
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isDisabledInput, todosLength]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsDisabledInput(true);

    const normalizeNewTitle = newTitle.trim();

    if (normalizeNewTitle.length <= 0) {
      onErrorMessage(ErrorNotificationMessage.TitleShouldNotBeEmpty);
      setIsDisabledInput(false);

      return;
    }

    try {
      await addTodo({
        title: normalizeNewTitle,
        completed: false,
        userId: USER_ID,
      });
    } catch (error) {
      onErrorMessage(ErrorNotificationMessage.UnableToAddTodos);
    } finally {
      setIsDisabledInput(false);
    }
  };

  return (
    <header className="todoapp__header">
      {!isLoadingTodos && todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: isActive })}
          data-cy="ToggleAllButton"
          onClick={onChangeAllTodos}
        />
      )}

      <form method="POST" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => onChangeNewTitle(event.target.value)}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
