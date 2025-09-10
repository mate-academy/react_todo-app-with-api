import { Dispatch, RefObject, SetStateAction, useState } from 'react';
import { Todo } from '../types/types';
import { ErrorMessages } from '../types/enums';
import { addTodos } from '../api/todos';

export const useAddTodos = (
  setCurrentError: Dispatch<SetStateAction<ErrorMessages | ''>>,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  inputRef: RefObject<HTMLInputElement>,
  setLoadingTodos: Dispatch<SetStateAction<number[]>>,
) => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleAddTodo = async (
    title: string,
    setSearchQuery: (value: string) => void,
  ) => {
    const newTodo: Todo = {
      id: 0,
      userId: 3349,
      title: title.trim(),
      completed: false,
    };

    if (title.trim() === '') {
      setCurrentError(ErrorMessages.EmptyTitle);

      return;
    }

    setLoadingTodos(prev => [...prev, newTodo.id]);
    setTempTodo(newTodo);
    try {
      const result = await addTodos(newTodo);

      setTodos(prev => [...prev, result]);

      setTempTodo(null);
      setSearchQuery('');
    } catch (error) {
      setCurrentError(ErrorMessages.Add);
      setTempTodo(null);
    } finally {
      setLoadingTodos(prev => {
        return prev.filter(id => id !== newTodo.id);
      });
      if (inputRef.current && !inputRef.current.disabled) {
        inputRef.current.focus();
      }
    }
  };

  return { tempTodo, handleAddTodo, setTempTodo };
};
