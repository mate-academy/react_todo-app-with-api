import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  onError: (value: ErrorMessages | null) => void;
  createTodo: (title: string) => void;
  isInputDisabled: boolean;
  activateToggleAll: boolean;
  setLoadingAll: (value: boolean) => void;
  toggleAll: () => void;
  focusTitleInput: boolean;
  inCompleteTodos: number;
};

export const TodoHeader: React.FC<Props> = ({
  onError,
  createTodo,
  isInputDisabled,
  activateToggleAll,
  setLoadingAll,
  toggleAll,
  focusTitleInput,
  inCompleteTodos,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const inputTitle = useRef<HTMLInputElement>(null);

  const addTodo = (e: FormEvent) => {
    e.preventDefault();
    const todoName = newTodoTitle.trim();

    if (todoName === '') {
      onError(ErrorMessages.emptyTitle);

      return;
    }

    createTodo(todoName);
    setNewTodoTitle('');

    inputTitle.current?.focus();
  };

  const handleToggleAll = async () => {
    setLoadingAll(true);
    await toggleAll();
  };

  useEffect(() => {
    if (focusTitleInput && inputTitle.current) {
      inputTitle.current?.focus();
    }
  }, [focusTitleInput, inCompleteTodos]);

  return (
    <header className="todoapp__header">
      {inCompleteTodos > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: activateToggleAll })}
          aria-label="mark all"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={addTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          disabled={isInputDisabled}
          ref={inputTitle}
        />
      </form>
    </header>
  );
};
