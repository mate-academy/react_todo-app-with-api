import { FC, FormEvent, useEffect, useState } from 'react';

import useFocusInput from '../hooks/useFocusInput';

interface Props {
  onErrorMessage: (message: string) => void;
  deletingId: number;
  allCompletedTodos: boolean;
  onAddTodo: (title: string) => Promise<void>;
  handleToggleCompleted: () => void;
  todosLength: number;
}

const Header: FC<Props> = ({
  onErrorMessage,
  deletingId,
  allCompletedTodos,
  onAddTodo,
  handleToggleCompleted,
  todosLength,
}) => {
  const inputRef = useFocusInput();
  const [title, setTitle] = useState('');
  const [isSendingTodo, setIsSendingTodo] = useState(false);

  useEffect(() => {
    if (!isSendingTodo || deletingId) {
      inputRef.current?.focus();
    }
  }, [isSendingTodo, deletingId, inputRef]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      onErrorMessage('Title should not be empty');

      return;
    }

    setIsSendingTodo(true);
    onAddTodo(title)
      .then(() => {
        setTitle('');
      })
      .catch(() => {
        onErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsSendingTodo(false);
        inputRef.current?.focus();
      });
  };

  return (
    <header className="todoapp__header">
      {!!todosLength && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompletedTodos ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleCompleted}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSendingTodo}
        />
      </form>
    </header>
  );
};

export default Header;
