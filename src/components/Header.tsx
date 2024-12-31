import cn from 'classnames';
import { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  newTodo: string;
  setNewTodo: (value: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  isLoading: boolean;
  isTodoDeleted: boolean;
  toggleAllTodos: () => void;
  unCompletedTodos: Todo[];
  todos: Todo[];
};

const Header: React.FC<Props> = ({
  newTodo,
  setNewTodo,
  handleSubmit,
  isSubmitting,
  isLoading,
  isTodoDeleted,
  toggleAllTodos,
  unCompletedTodos,
  todos,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && !isSubmitting && !isLoading) {
      inputRef.current.focus();
    }
  }, [newTodo, isSubmitting, isLoading, isTodoDeleted, todos]);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: unCompletedTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          disabled={isSubmitting}
          autoFocus
        />
      </form>
    </header>
  );
};

export default Header;
