import classNames from 'classnames';
import { forwardRef, useState } from 'react';

type Props = {
  onCreateTodo: (value: string) => Promise<void>;
  onToggleTodos: (completed: boolean) => void;
  todosCountInfo: number[];
};

export const Header = forwardRef<HTMLInputElement, Props>(function Header(
  {
    todosCountInfo: [allTodosCount, activeTodosCount],
    onCreateTodo,
    onToggleTodos,
  },
  ref,
) {
  const [title, setTitle] = useState('');

  const isAllCompleted = activeTodosCount === 0;

  const handleOnSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();

    onCreateTodo(title)
      .then(() => {
        setTitle('');
      })
      .catch(() => {});
  };

  return (
    <header className="todoapp__header">
      {allTodosCount > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleTodos(!isAllCompleted)}
        />
      )}

      <form onSubmit={handleOnSubmitForm}>
        <input
          ref={ref}
          onChange={event => setTitle(event.target.value)}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
        />
      </form>
    </header>
  );
});
