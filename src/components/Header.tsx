import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../types/Error';

type Props = {
  onAddTodo: (title: string) => Promise<void>;
  isAllTodosCompleted: boolean;
  setError: React.Dispatch<React.SetStateAction<ErrorMessage | null>>;
  fieldTitle: React.RefObject<HTMLInputElement>;
  onChangeStatus: () => void;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  onAddTodo,
  isAllTodosCompleted,
  setError,
  fieldTitle,
  onChangeStatus,
  hasTodos,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fieldTitle.current?.focus();
  }, [isSubmitting, fieldTitle]);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = newTitle.trim();

    if (!title) {
      setError(ErrorMessage.title);
    } else {
      setIsSubmitting(true);
      onAddTodo(title)
        .then(() => {
          setNewTitle('');
          setIsSubmitting(false);
        })
        .catch(() => {
          setError(ErrorMessage.add);
          setIsSubmitting(false);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          onClick={onChangeStatus}
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllTodosCompleted })}
          data-cy="ToggleAllButton"
        />
      )}
      <form onSubmit={handleOnSubmit}>
        <input
          ref={fieldTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
