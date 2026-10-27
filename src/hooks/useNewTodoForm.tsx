import { useEffect, useRef, useState, FormEvent } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';

type Params = {
  onError: (value: ErrorMessage | '') => void;
  onAdd: (title: string) => Promise<void>;
  isDisabled: boolean;
  todoList: Todo[];
};

export const useNewTodoForm = ({
  onError,
  onAdd,
  isDisabled,
  todoList,
}: Params) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clearTitle = title.trim();

    if (clearTitle === '') {
      onError(ErrorMessage.EmptyTitle);

      return;
    }

    onAdd(clearTitle)
      .then(() => setTitle(''))
      .catch(() => {});
  };

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled, todoList.length]);

  return {
    handleSubmit,
    title,
    setTitle,
    inputRef,
  };
};
