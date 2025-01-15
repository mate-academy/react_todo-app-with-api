import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  isAllActive: () => boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isDisabledInput: boolean;
  query: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  massUpdate: (updatedTodos: Todo[]) => Promise<void>;
  isOneActive: () => Todo[];
};

export const Header: React.FC<Props> = ({
  todos,
  isAllActive,
  handleSubmit,
  inputRef,
  isDisabledInput,
  query,
  handleChange,
  massUpdate,
  isOneActive,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllActive(),
          })}
          data-cy="ToggleAllButton"
          onClick={() => massUpdate(isOneActive())}
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
          disabled={isDisabledInput}
          value={query}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
