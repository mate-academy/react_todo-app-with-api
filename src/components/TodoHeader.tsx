import classNames from 'classnames';
import { useEffect } from 'react';
import { Todo } from '../types/Todo';

interface TodoHeaderProps {
  handleAddTodo: (title: string) => void;
  queryTodo: string;
  setQueryTodo: (queryTodo: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleToggleAll: () => void;
  todos: Todo[];
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  handleAddTodo,
  queryTodo,
  setQueryTodo,
  setError,
  isInputDisabled,
  inputRef,
  handleToggleAll,
  todos,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (queryTodo && queryTodo.trim()) {
      handleAddTodo(queryTodo.trim());
    } else {
      setError('Title should not be empty');
    }
  };

  useEffect(() => {
    if (!isInputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  });

  const allCompleted = todos.every(todo => todo.completed);
  const blurButton = todos.length === 0;

  return (
    <header className="todoapp__header">
      {blurButton ? (
        <div></div>
      ) : (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={queryTodo}
          onChange={event => setQueryTodo(event.target.value)}
          autoFocus
          disabled={isInputDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
