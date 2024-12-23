import React, { useRef, useEffect, useState } from 'react';
import { ErrorStatus } from '../types/ErrorStatus';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorStatus>>;
  todoLength: number;
  todoList: Todo[];
  onToggleAll: () => Promise<void>;
  allTodosCompleted: boolean;
};

export const Header: React.FC<Props> = props => {
  const {
    onAddTodo,
    setErrorMessage,
    todoLength,
    onToggleAll,
    allTodosCompleted,
  } = props;

  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [inputValue, isLoading, todoLength]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      setErrorMessage(ErrorStatus.EmptyTitle);

      return;
    }

    try {
      setIsLoading(true);
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (error) {
    } finally {
      setIsLoading(false);
      inputRef?.current?.focus();
    }
  };

  return (
    <header className="todoapp__header">
      {todoLength !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allTodosCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
