import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { USER_ID } from '../api/todos';

type Props = {
  onSubmit: (todo: Todo) => Promise<void>;
  validation: (error: string) => void;
  isLoading: boolean;
  isTodosEmpty: boolean;
  areAllTodosCompleted: () => boolean;
  toggleCompletedStatus: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  onSubmit,
  validation,
  isLoading,
  isTodosEmpty,
  areAllTodosCompleted,
  toggleCompletedStatus,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleRef.current && !isLoading) {
      titleRef.current.focus();
    }
  }, [isLoading]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const reset = () => {
    setTitle('');

    validation('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      validation('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    onSubmit({
      id: 0,
      completed: false,
      title: trimmedTitle,
      userId: USER_ID,
    })
      .then(reset)
      .finally(() => setIsSubmitting(false));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!isTodosEmpty && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodosCompleted(),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleCompletedStatus}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={titleRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          value={title}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
