import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { Errors } from '../types/ErrorType';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: Dispatch<React.SetStateAction<Errors>>;
  tempTodo: Todo | null;
  loadingTodo: number[];
  onSelectAll: () => Promise<void>;
  allTodosCompleted: boolean;
  todosLength: number;
};

export const TodoHeader: React.FC<Props> = props => {
  const {
    onAddTodo,
    setErrorMessage,
    tempTodo,
    loadingTodo,
    onSelectAll,
    allTodosCompleted,
    todosLength,
  } = props;

  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (err) {}
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, loadingTodo, todosLength]);

  return (
    <header className="todoapp__header">
      {!!todosLength && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allTodosCompleted })}
          data-cy="ToggleAllButton"
          onClick={onSelectAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
