import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef } from 'react';

type Props = {
  todosFromServer: Todo[];
  activeItems: Todo[];
  completedItems: Todo[];
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
  ) => Promise<void> | undefined;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  addingTodo: boolean;
  loader: number[];
  editingTodoId: number | null;
  updateToCompletedTodos: (todos: Todo[]) => void;
};

export const Header: React.FC<Props> = ({
  todosFromServer,
  activeItems,
  completedItems,
  onSubmit,
  title,
  setTitle,
  addingTodo,
  loader,
  editingTodoId,
  updateToCompletedTodos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loader.length === 0 && !addingTodo && !editingTodoId) {
      inputRef.current?.focus();
    }
  }, [loader, addingTodo, editingTodoId]);

  return (
    <header className="todoapp__header">
      {todosFromServer.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeItems.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={() =>
            updateToCompletedTodos(
              activeItems.length > 0 ? activeItems : completedItems,
            )
          }
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={addingTodo || loader.length !== 0}
        />
      </form>
    </header>
  );
};
