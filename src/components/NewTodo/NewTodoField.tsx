import { useEffect, useState } from 'react';
import { ERRORS } from '../../types/Todo';

interface Props {
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onError: (error: string) => void;
  addTodo: (title: string) => Promise<void>;
}

export const NewTodoField: React.FC<Props> = ({
  loading,
  inputRef,
  onError,
  addTodo,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (normalizedTitle.length === 0) {
      onError(ERRORS.EMPTY_TITLE);

      return;
    }

    addTodo(normalizedTitle.trim())
      .then(() => setTitle(''))
      .catch(() => {});
  };

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading, inputRef]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={loading}
        autoFocus
        ref={inputRef}
      />
    </form>
  );
};
