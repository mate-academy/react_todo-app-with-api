import classNames from 'classnames';
import { forwardRef, useState } from 'react';

type Props = {
  todosCountInfo: number[];
  onAddNewTodo: (title: string) => Promise<void>;
  onToggleTodos: (completed: boolean) => void;
};

export const NewTodo = forwardRef<HTMLInputElement, Props>(
  (
    {
      todosCountInfo: [allTodosCount, activeTodosCount],
      onAddNewTodo,
      onToggleTodos,
    },
    ref,
  ) => {
    const [title, setTitle] = useState('');

    const isAllCompleted = activeTodosCount === 0;

    const handleNewTodo = (event: React.FormEvent) => {
      event.preventDefault();

      onAddNewTodo(title)
        .then(() => {
          setTitle('');
        })
        .catch(() => {});
    };

    const handleToggleTodos = () => {
      onToggleTodos(!isAllCompleted);
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
            onClick={handleToggleTodos}
          />
        )}

        <form
          onSubmit={event => {
            handleNewTodo(event);
          }}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setTitle('');
              }
            }}
            ref={ref}
            autoFocus
          />
        </form>
      </header>
    );
  },
);

NewTodo.displayName = 'NewTodo';
