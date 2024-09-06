import { ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages'; // Import the ErrorMessages enum

type Props = {
  todo: Omit<Todo, 'id'>;
  loading: boolean;
  todos: Todo[];
  todosFromServer: Todo[];
  leftTodos: Todo[];
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onError: (error: string) => void;
  onLoading: (status: boolean) => void;
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todo,
  loading,
  todos,
  todosFromServer,
  onSubmit,
  onChange,
  onReset,
  onError,
  onLoading,
  toggleAll,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [onReset]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    onError('');
    event.preventDefault();

    if (!todo.title.trim()) {
      onError(ErrorMessages.EmptyTitle);

      return;
    }

    onLoading(true);
    onSubmit(todo)
      .then(onReset)
      .finally(() => onLoading(false));
  };

  return (
    <header className="todoapp__header">
      {todosFromServer.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(item => item.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          value={todo.title}
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => onChange(event)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
