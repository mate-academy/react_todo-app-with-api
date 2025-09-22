import { Todo } from '../../types/Todo';
import { NotificationType } from '../../types/NotificationType';
import { useEffect, useState } from 'react';
import cls from 'classnames';

type HeaderProps = {
  userID: number; // Added userID prop
  inputRef?: React.RefObject<HTMLInputElement>; // Optional ref for input focus
  onSubmit: (todo: Todo) => Promise<void>; // Updated to accept full Todo type
  setError: (message: string) => void;
  toggleAll?: (todos: Todo[]) => void; // Function to toggle all todos
  todos: Todo[]; // Optional todos array to determine allCompleted state
  loader: boolean | number; // Optional loader prop to indicate loading state
};

export const Header: React.FC<HeaderProps> = ({
  userID,
  inputRef,
  onSubmit,
  setError,
  toggleAll,
  todos,
  loader,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, inputRef]);

  const reset = () => {
    setNewTodoTitle('');
    inputRef?.current?.focus();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedTitle = newTodoTitle.trim();

    if (trimmedTitle.length === 0) {
      setError(NotificationType.TITLE);

      return;
    }

    setIsSubmitting(true);
    onSubmit({ title: trimmedTitle, completed: false, userId: userID, id: 0 })
      .then(reset)
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const cleanedTitle = event.target.value.replace(
      /[^a-zA-Zа-яА-ЯёЁґҐєЄіІїЇ0-9 ]/g,
      '',
    );

    setNewTodoTitle(cleanedTitle);
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && !loader && (
        <button
          type="button"
          className={cls('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleAll && toggleAll([])} // Pass an empty array or actual todos if available
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={isSubmitting}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
