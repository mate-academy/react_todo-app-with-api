import { FC, FormEvent, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  query: string;
  onQueryChange: (newQuery: string) => void;
  addTodo: (event: FormEvent<HTMLFormElement>) => void;
  toggleAllTodos: () => void;
  isLoading: boolean;
  loadingIds: number[];
}

export const Header: FC<Props> = ({
  todos,
  query,
  onQueryChange,
  addTodo,
  toggleAllTodos,
  isLoading,
  loadingIds,
}) => {
  const todoFieldRef = useRef<HTMLInputElement>(null);
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (todoFieldRef.current) {
      todoFieldRef.current.focus();
    }
  }, [isLoading, loadingIds]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={toggleAllTodos}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={event => addTodo(event)}>
        <input
          ref={todoFieldRef}
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
