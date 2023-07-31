import { useState } from 'react';

import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  isTodos: boolean;
  activeTodos: Todo[];
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  userId: number;
  setError: (error: string) => void;
  clearError: (clearOption: string) => void;
  updateActiveTodos: () => void;
};

export const Header: React.FC<Props> = ({
  isTodos,
  activeTodos,
  addTodo,
  userId,
  setError,
  clearError,
  updateActiveTodos,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title can\'t be empty');
      clearError('');
    } else {
      setIsSubmitting(true);

      addTodo({ userId, title, completed: false })
        .then(() => setTitle(''))
        .finally(() => setIsSubmitting(false));
    }
  };

  return (
    <header className="todoapp__header">
      {isTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: !activeTodos.length })}
          aria-label="activeButton"
          onClick={updateActiveTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
