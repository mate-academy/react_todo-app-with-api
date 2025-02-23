import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import './Header.scss';
type Props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAll: () => void;
  todos: Todo[];
};
export const Header: React.FC<Props> = ({
  handleSubmit,
  handleInputChange,
  title,
  isDisabled,
  inputRef,
  toggleAll,
  todos,
}) => {
  const allTodosCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputChange}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
