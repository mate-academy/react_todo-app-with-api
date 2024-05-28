import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { LegacyRef } from 'react';

type Props = {
  todos: Todo[];
  value: string;
  inputDisabled: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputRef: LegacyRef<HTMLInputElement>;
  setValue: (value: string) => void;
  toggleAll: (completed: boolean) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  value,
  inputDisabled,
  handleSubmit,
  inputRef,
  setValue,
  toggleAll,
}) => {
  const handleAllTodos = () => {
    const completed = !todos.every(todo => todo.completed);

    toggleAll(completed);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleAllTodos}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={value}
          onChange={event => setValue(event.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
