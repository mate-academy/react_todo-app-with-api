import { FC, FormEvent, MutableRefObject, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todoFieldRef: MutableRefObject<HTMLInputElement | null>;
  todos: Todo[];
  query: string;
  onQueryChange: (newQuery: string) => void;
  addTodo: (event: FormEvent<HTMLFormElement>) => void;
  toggleAllTodos: () => void;
  isLoading: boolean;
  isTodosExist: boolean;
}

export const Header: FC<Props> = ({
  todoFieldRef,
  todos,
  query,
  onQueryChange,
  addTodo,
  toggleAllTodos,
  isLoading,
  isTodosExist,
}) => {
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (!isLoading) {
      todoFieldRef.current?.focus();
    }
  }, [isLoading, todoFieldRef]);

  return (
    <header className="todoapp__header">
      {isTodosExist && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

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
