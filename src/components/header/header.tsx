import { FormEvent, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Omit<Todo, 'id'>;
  loading: boolean;
  todos: Todo[];
  todosFromServer: Todo[];
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
      onError('Title should not be empty');

      return;
    }

    onLoading(true);
    onSubmit(todo)
      .then(onReset)
      .finally(() => onLoading(false));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todosFromServer.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(item => item.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleAll()}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          value={todo.title}
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => onChange(event.target.value)}
          disabled={loading ? true : false}
        />
      </form>
    </header>
  );
};
