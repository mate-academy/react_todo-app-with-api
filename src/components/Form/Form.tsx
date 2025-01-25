import { useEffect, useRef, useState } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  setTitle: (title: string) => void;
  setCurrentError: (error: Errors | null) => void;
  isNewTodoAdding: boolean;
  isAdded: boolean | null;
  isTodoDeleting: boolean;
  needAutoFocus: boolean | null;
};

export const Form: React.FC<Props> = ({
  setTitle,
  setCurrentError,
  isNewTodoAdding,
  isAdded,
  isTodoDeleting,
  needAutoFocus,
}) => {
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdded || isTodoDeleting) {
      if (isAdded) {
        setCurrentTitle('');
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isAdded, isTodoDeleting]);

  useEffect(() => {
    if (!needAutoFocus) {
      return;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [needAutoFocus]);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = currentTitle.trim();

    if (trimmedTitle) {
      setTitle(trimmedTitle);
    } else {
      setCurrentError(Errors.title);
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={currentTitle}
        onChange={e => setCurrentTitle(e.target.value)}
        disabled={isNewTodoAdding}
        ref={inputRef}
        autoFocus
      />
    </form>
  );
};
