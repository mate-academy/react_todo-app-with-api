import { FormEvent, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Errors';

type Props = {
  newTodoTitle: string;
  setNewTodo: (value: string) => void;
  addTodo: () => void;
  onError: (error: string) => void;
  onDisabled: boolean;
  todos: Todo[];
  getCompletedTodos: () => Todo[];
  handleToggleAll: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  isLoading: number[];
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodo,
  addTodo,
  onDisabled,
  onError,
  todos,
  getCompletedTodos,
  handleToggleAll,
  inputRef,
  isLoading,
}) => {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isLoading]);

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      onError(ErrorType.EMPTY_TITLE);
      setTimeout(() => onError(''), 3000);

      return;
    }

    addTodo();
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.length === getCompletedTodos().length,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          disabled={onDisabled}
          onChange={e => setNewTodo(e.target.value)}
        />
      </form>
    </header>
  );
};
