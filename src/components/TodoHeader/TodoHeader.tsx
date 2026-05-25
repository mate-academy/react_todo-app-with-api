import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type TodoHeaderProps = {
  todos: Todo[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  onChangeTitle: (newTitle: string) => void;
  onToggleAll: () => void;
};

export const TodoHeader = ({
  todos,
  onSubmit,
  isLoading,
  inputRef,
  title,
  onChangeTitle,
  onToggleAll,
}: TodoHeaderProps) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          ref={inputRef}
          value={title}
          onChange={e => onChangeTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
