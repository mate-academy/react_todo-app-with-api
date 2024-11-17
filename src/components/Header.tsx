import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FormEvent } from 'react';

interface HeaderProps {
  value: string;
  todos: Todo[];
  completedTodos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
  loadingTodos: number[];
  onTodosToggle: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  value,
  todos,
  completedTodos,
  inputRef,
  loadingTodos,
  onTodosToggle,
  onSubmit,
  onInputChange,
}) => {
  const isLoading = loadingTodos.length > 0;

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos.length === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={onTodosToggle}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          ref={inputRef}
          onChange={onInputChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
