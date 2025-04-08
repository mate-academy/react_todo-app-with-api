/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  handleAddTodos: (title: string) => Promise<boolean | null>;
  tempTodo: Todo | null;
  todos: Todo[];
  handleCompleteAllTodos: () => void;
  isLoading: boolean;
};

export const Header: FC<Props> = ({
  handleAddTodos,
  tempTodo,
  todos,
  handleCompleteAllTodos,
  isLoading,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!tempTodo && query) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  const handleOnEnter = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const error = await handleAddTodos(query);

      if (!error) {
        setQuery('');
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && !isLoading && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.length > 0 && todos.every(todo => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleCompleteAllTodos}
        />
      )}
      <form onSubmit={e => e.preventDefault()}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onKeyDown={handleOnEnter}
          onChange={event => setQuery(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
