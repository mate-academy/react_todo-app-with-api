import classNames from 'classnames';
import { ErrorMessagesNotification } from '../api/todos';
import { useEffect, useState } from 'react';

type Props = {
  onAdd: (title: string) => Promise<void>;
  allCompleted: boolean;
  setError: (error: ErrorMessagesNotification | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  hasTodos: boolean;
};

const CreateTodo: React.FC<Props> = ({
  onAdd,
  allCompleted,
  setError,
  inputRef,
  onToggleAll,
  hasTodos,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [todo, setTodo] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!todo.trim()) {
      setError(ErrorMessagesNotification.EMPTY_TITLE);

      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await onAdd(todo);
      setTodo(todo);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      setTodo('');
    } catch (error) {
      setError(ErrorMessagesNotification.ADD);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="todo"
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          ref={inputRef}
          placeholder="What needs to be done?"
          disabled={isLoading}
          onChange={e => setTodo(e.target.value)}
          value={todo}
        />
      </form>
    </header>
  );
};

export default CreateTodo;
