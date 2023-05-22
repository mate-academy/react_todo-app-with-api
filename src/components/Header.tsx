/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  query: string;
  onChange(value: string): void;
  onSubmit(e: FormEvent<HTMLFormElement>): void;
  isLoading: boolean;
  activeTodos: Todo[];
  onToggle(todoId: number[], completed: boolean): void;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  query,
  onChange,
  onSubmit,
  isLoading,
  activeTodos,
  onToggle,
  todos,
}) => {
  const [isActive, setIsActive] = useState(true);

  const handleToggleAll = () => {
    const changedTodosId = todos
      .filter(todo => todo.completed === !isActive)
      .map(todo => todo.id);

    onToggle(changedTodosId, isActive);
    setIsActive(currState => !currState);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: activeTodos.length === 0,
        })}
        onClick={handleToggleAll}
      />

      <form
        onSubmit={onSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
