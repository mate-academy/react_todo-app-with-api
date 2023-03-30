import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  isLoading: boolean,
  todos: Todo[],
  completedTodos: Todo[],
  createdTodo: (newTitle: string) => void,
  onToggle: () => void,
};

export const Header: React.FC<Props> = ({
  isLoading,
  todos,
  completedTodos,
  createdTodo,
  onToggle,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    createdTodo(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: completedTodos.length === todos.length },
        )}
        aria-label="All"
        onClick={onToggle}
      />

      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          disabled={isLoading}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
