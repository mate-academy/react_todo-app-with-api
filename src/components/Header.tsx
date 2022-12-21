import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  onTitleChange: (title: string) => void;
  isAdding: boolean;
  onToggleAll: () => void;
  activeTodos: Todo[];
  todos: Todo[];
};

export const Header: React.FC<Props> = (props) => {
  const {
    onSubmit,
    title,
    onTitleChange,
    isAdding,
    onToggleAll,
    activeTodos,
    todos,
  } = props;
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all', {
              active: !activeTodos.length,
            },
          )}
          aria-label="Toggle All"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
