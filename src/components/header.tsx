import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef } from 'react';

type Props = {
  todosFromServer: Todo[];
  itemsLeft: Todo[];
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
  itemsLeft,
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
      {/* this button should have `active` class only if all todos are completed */}
      {todosFromServer.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: itemsLeft.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={() =>
            updateToCompletedTodos(
              itemsLeft.length > 0 ? itemsLeft : completedItems,
            )
          }
        />
      )}

      {/* Add a todo on form submit */}
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
