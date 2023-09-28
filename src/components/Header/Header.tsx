/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type HeaderProps = {
  title: string;
  setTitle: (string: string) => void;
  handleSubmit: (event: { preventDefault: () => void }) => void;
  todos: Todo[];
  isLoading: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  setTitle,
  handleSubmit,
  todos,
  isLoading,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all',
            { active: todos.every(todo => todo.completed) })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          disabled={isLoading}
          ref={(input) => input && input.focus()}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </form>
    </header>
  );
};
