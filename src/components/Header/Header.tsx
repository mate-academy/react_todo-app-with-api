import { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type HeaderProps = {
  todos: Todo[];
  allTodosCompleted: boolean;
  tempTodo: Todo | null;
  onSubmit: (query: string, resetInput: () => void) => Promise<void>;
  onToggleAllComplete: () => Promise<void>;
};

const Header: React.FC<HeaderProps> = ({
  todos,
  allTodosCompleted,
  tempTodo,
  onSubmit,
  onToggleAllComplete,
}) => {
  const [query, setQuery] = useState('');
  const addInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tempTodo || todos.length > 0) {
      addInputRef.current?.focus();
    }
  }, [tempTodo, todos]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onSubmit(query, () => setQuery(''));

    addInputRef.current?.focus();
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAllComplete}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={addInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={tempTodo?.id === 0}
        />
      </form>
    </header>
  );
};

export default Header;
