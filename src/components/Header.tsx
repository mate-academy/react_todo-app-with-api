import React, { RefObject, useState } from 'react';
import { ErrorMessageType } from '../constants/ErrorMessageType';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { DEFAULT_COMPLETED, USER_ID } from '../constants/appConstants';

type Props = {
  onSubmit: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  handleError: (error: ErrorMessageType) => void;
  onToggle: () => void;
  inputRef: RefObject<HTMLInputElement>;
  isLoading: boolean;
  isAllCompleted: boolean;
  todosCount: number;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  handleError,
  onToggle,
  inputRef,
  isLoading,
  isAllCompleted,
  todosCount,
}) => {
  const [todoInput, setTodoInput] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    handleError(ErrorMessageType.None);

    const prepearedInputValue = todoInput.trim();

    if (!prepearedInputValue) {
      handleError(ErrorMessageType.EmptyTitle);

      return;
    }

    onSubmit({
      title: prepearedInputValue,
      completed: DEFAULT_COMPLETED,
      userId: USER_ID,
    })
      .then(() => setTodoInput(''))
      .catch(() => setTodoInput(prepearedInputValue));
  };

  const isToggleAllVisible = todosCount > 0;

  return (
    <header className="todoapp__header">
      {isToggleAllVisible && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggle}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoInput}
          onChange={e => setTodoInput(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
