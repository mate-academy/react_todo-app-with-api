import { FormEvent, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  newTodoTitle: string;
  setNewTodo: (value: string) => void;
  addTodo: () => void;
  onError: (error: string) => void;
  onDisabled: boolean;
  todos: Todo[];
  handleToggleAll: () => void;
  getCompletedTodosArray: () => Todo[];
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodo,
  addTodo,
  onError,
  onDisabled,
  todos,
  handleToggleAll,
  getCompletedTodosArray,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      onError('Title should not be empty');
      setTimeout(() => onError(''), 3000);

      return;
    }

    addTodo();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length === getCompletedTodosArray().length,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodo(e.target.value)}
          disabled={onDisabled}
        />
      </form>
    </header>
  );
};
