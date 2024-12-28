import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  activeTodosQuantity: number;
  onSubmitNewTodo: (event: React.FormEvent) => void;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputDisabled: boolean;
  newTodoTitle: string;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAllStatuses: () => void;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  activeTodosQuantity,
  onSubmitNewTodo,
  onTitleChange,
  inputDisabled,
  newTodoTitle,
  inputRef,
  toggleAllStatuses,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {!inputDisabled && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !activeTodosQuantity,
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleAllStatuses()}
        />
      )}

      <form onSubmit={onSubmitNewTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={onTitleChange}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
