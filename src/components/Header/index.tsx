import { FormEvent, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { ErrorMessages } from '../../types/ErrorsMessages';

type Props = {
  todosFromServer: Todo[];
  todo: Omit<Todo, 'id'>;
  loading: boolean;
  todos: Todo[];
  leftTodos: Todo[];
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  onChange: (value: string) => void;
  onReset: () => void;
  onError: (error: string) => void;
  onLoading: (status: boolean) => void;
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todo,
  loading,
  todos,
  leftTodos,
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
    titleField.current?.focus();
  }, [onReset]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    onError('');
    event.preventDefault();

    if (!todo.title.trim()) {
      onError(ErrorMessages.TITLE_SHOULD_NOT_BE_EMPTY);

      return;
    }

    onLoading(true);
    try {
      await onSubmit(todo);
      onReset();
    } catch {
      onError(ErrorMessages.UNABLE_TO_ADD_TODO);
    } finally {
      onLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      {todosFromServer.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.length >= 0 && leftTodos.length === 0,
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
          onChange={event => onChange(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
