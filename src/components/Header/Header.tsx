import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect } from 'react';

type Props = {
  isLoading: boolean;
  todos: Todo[];
  allTodosCompleted: (todos: Todo[]) => boolean;
  handleToggleAllButton: (todos: Todo[]) => void;
  handleSubmit: (event: React.FormEvent) => void;
  field: React.RefObject<HTMLInputElement>;
  processingIds: number[];
  editingTodo: Todo | null;
  title: string;
  setTitle: (value: string) => void;
};

export const Header: React.FC<Props> = ({
  isLoading,
  todos,
  allTodosCompleted,
  handleToggleAllButton,
  handleSubmit,
  field,
  processingIds,
  editingTodo,
  title,
  setTitle,
}) => {
  useEffect(() => {
    if (!isLoading) {
      field.current?.focus();
    }
  }, [isLoading, field]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted(todos),
          })}
          data-cy="ToggleAllButton"
          disabled={todos.length === 0}
          onClick={() => handleToggleAllButton(todos)}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={field}
          disabled={
            isLoading || processingIds.length > 0 || editingTodo !== null
          }
          type="text"
          value={title}
          onChange={event => setTitle(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
