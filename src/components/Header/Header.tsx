import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface HeaderProps {
  todos: Todo[];
  handleAddTodo: (query: string) => Promise<void>;
  handleToggling: (todosToToggle: Todo[]) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  handleAddTodo,
  handleToggling,
}) => {
  const [query, setQuery] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const newTodoInput = useRef<HTMLInputElement>(null);

  const allActive = todos.every(todo => todo.completed);
  const toToggle = todos.filter(todo => todo.completed === allActive);

  useEffect(() => {
    if (newTodoInput.current) {
      newTodoInput.current.focus();
    }
  }, [todos, isDisabled]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsDisabled(true);

    handleAddTodo(query.trim())
      .then(() => {
        setQuery('');
      })
      .catch(() => {})
      .finally(() => setIsDisabled(false));
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: allActive })}
          data-cy="ToggleAllButton"
          onClick={() => handleToggling(toToggle)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          ref={newTodoInput}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
