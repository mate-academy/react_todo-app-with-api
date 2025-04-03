import { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

export const useTodoUpdate = (
  updateTodo: Todo,
  setIsUpdate: (val: boolean) => void,
  onUpdateTodo: (todo: Todo) => Promise<void>,
  onDelete: (id: number) => Promise<void>,
) => {
  const [inputQuery, setInputQuery] = useState(updateTodo.title);
  const [isError, setIsError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const deleteRequestSent = useRef(false);

  const focusInput = useRef<HTMLInputElement>(null);

  const handleKeyUp = (event: globalThis.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsUpdate(false);
    }
  };

  const handleUpdateTodo = () => {
    if (isProcessing) {
      return;
    }

    if (inputQuery.trim()) {
      const updatedTodo = {
        id: updateTodo.id,
        userId: USER_ID,
        title: inputQuery.trim(),
        completed: updateTodo.completed,
      };

      onUpdateTodo(updatedTodo)
        .then(() => {
          setIsUpdate(false);
          setIsError(false);
        })
        .catch(() => {
          focusInput.current?.focus();
          setIsError(true);
        })
        .finally(() => {
          setIsProcessing(false);
        });

      return;
    }

    if (!deleteRequestSent.current) {
      deleteRequestSent.current = true;
      onDelete(updateTodo.id)
        .then(() => {
          setIsUpdate(false);
          setIsError(false);
        })
        .catch(() => {
          setIsError(true);
          deleteRequestSent.current = false;
          focusInput.current?.focus();
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  };

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (inputQuery.trim() === updateTodo.title && !isError) {
      setIsUpdate(false);

      return;
    }

    handleUpdateTodo();
  };

  const handleOnBlur = () => {
    if (isError || isProcessing) {
      focusInput.current?.focus();

      return;
    }

    if (inputQuery.trim() === updateTodo.title) {
      setIsUpdate(false);

      return;
    }

    handleUpdateTodo();
  };

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    focusInput.current?.focus();
  }, [updateTodo.id]);

  return {
    handleOnSubmit,
    handleOnBlur,
    setInputQuery,
    inputQuery,
    focusInput,
  };
};
