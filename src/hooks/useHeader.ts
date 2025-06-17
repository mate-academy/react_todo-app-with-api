import { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { ErrorNotificationMessage } from '../types/ErrorNotificationMessage';

interface UseHeaderProps {
  newTitle: string;
  onChangeNewTitle: (newTitle: string) => void;
  addTodo: ({ title, completed, userId }: Omit<Todo, 'id'>) => Promise<void>;
  onErrorMessage: (errorMessage: ErrorNotificationMessage) => void;
  todosLength: number;
}

export const useHeader = ({
  newTitle,
  onChangeNewTitle,
  addTodo,
  onErrorMessage,
  todosLength,
}: UseHeaderProps) => {
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isDisabledInput, todosLength]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsDisabledInput(true);

    const normalizeNewTitle = newTitle.trim();

    if (normalizeNewTitle.length <= 0) {
      onErrorMessage(ErrorNotificationMessage.TitleShouldNotBeEmpty);
      setIsDisabledInput(false);

      return;
    }

    try {
      await addTodo({
        title: normalizeNewTitle,
        completed: false,
        userId: USER_ID,
      });
      onChangeNewTitle('');
    } catch (error) {
      onErrorMessage(ErrorNotificationMessage.UnableToAddTodos);
    } finally {
      setIsDisabledInput(false);
    }
  };

  return {
    isDisabledInput,
    inputRef,
    onSubmit,
  };
};
