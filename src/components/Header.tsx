import { FC } from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../types/enums';

interface HeaderProps {
  allCompleted: boolean;
  onAddTodo: (title: string) => Promise<void>;
  onToggleAllTodos: () => void;
  title: string;
  setTitle: (value: string) => void;
  todoCount: number;
  isAdding: boolean;
  setError: (message: ErrorMessages) => void;
}

export const Header: FC<HeaderProps> = ({
  allCompleted,
  onAddTodo,
  onToggleAllTodos,
  title,
  setTitle,
  todoCount,
  isAdding,
  setError,
}) => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await onAddTodo(title.trim());
    } catch (error) {
      setError(ErrorMessages.ADDING_TODOS);
      const timer = setTimeout(() => setError(ErrorMessages.DEFAULT), 3000);

      return () => clearTimeout(timer);
    }
  };

  return (
    <header className="todoapp__header">
      {todoCount > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          onClick={onToggleAllTodos}
          data-cy="ToggleAllButton"
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
