import { Dispatch, SetStateAction } from 'react';
import { useAppContext } from './useAppContext';
import { Todo } from '../types';
import { postTodo } from '../helpers';

export const useFormSubmit = () => {
  const { setErrorType, setTempTodo, setTodos } = useAppContext();

  const onFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    query: string,
    setQuery: Dispatch<SetStateAction<string>>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
  ) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setErrorType('empty');

      return;
    }

    try {
      setIsLoading(true);

      setTempTodo({
        isLoading: true,
        todo: {
          title: trimmedQuery,
          id: 0,
          completed: false,
        },
      });

      const result = await postTodo(trimmedQuery);

      setTodos(prevState => [...prevState, result as Todo]);

      setQuery('');
    } catch (err) {
      setErrorType('add');
    } finally {
      setIsLoading(false);
      setTempTodo({
        todo: null,
        isLoading: false,
      });
    }
  };

  return { onFormSubmit };
};
