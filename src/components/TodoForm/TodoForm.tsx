import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  handleAddTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (message: string | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoForm: React.FC<Props> = ({
  handleAddTodo,
  setErrorMessage,
  inputRef,
}) => {
  const [title, setTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isInputDisabled) {
      inputRef.current?.focus();
    }
  }, [isInputDisabled]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setIsInputDisabled(true);

    try {
      await handleAddTodo({
        userId: 3046,
        title: trimmedTitle,
        completed: false,
      });

      setTitle('');
    } catch {
      setErrorMessage(ErrorMessage.AddTodoFailed);
    } finally {
      setIsInputDisabled(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={isInputDisabled}
      />
    </form>
  );
};
