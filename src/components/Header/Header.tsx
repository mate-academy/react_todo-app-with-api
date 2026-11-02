import cn from 'classnames';
import { Todo } from '../../types/Todo';

type HeaderProps = {
  todos: Todo[];
  loading: boolean;
  title: string;
  tempTodo: Todo | null;
  inputRef: React.RefObject<HTMLInputElement>;
  setTitle: (title: string) => void;
  handleAllToggle: (newCompleted: boolean) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header = ({
  todos,
  loading,
  title,
  tempTodo,
  inputRef,
  setTitle,
  handleAllToggle,
  handleSubmit,
}: HeaderProps) => {
  const showAllCompletedBtn = !loading && todos.length > 0;
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {showAllCompletedBtn && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleAllToggle(!allCompleted)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={tempTodo !== null}
          autoFocus
        />
      </form>
    </header>
  );
};
