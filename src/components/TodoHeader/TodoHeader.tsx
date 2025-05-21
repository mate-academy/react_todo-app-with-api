import { useEffect } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  query: string;
  handleQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  query,
  handleQuery,
  handleSubmit,
  isLoading,
  inputRef,
  toggleAll,
}) => {
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [inputRef, isLoading]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQuery}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
