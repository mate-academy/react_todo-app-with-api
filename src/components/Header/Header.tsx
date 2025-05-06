import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  onAdd: (todo: Partial<Todo>) => Promise<unknown>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  noTodos: boolean;
  onToggleCompleted: () => void;
  hasNotCompleted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onAdd,
  inputRef,
  noTodos,
  onToggleCompleted: onToggleNotCompleted,
  hasNotCompleted,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAdd({ title }).then(() => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!noTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: !hasNotCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleNotCompleted}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};
