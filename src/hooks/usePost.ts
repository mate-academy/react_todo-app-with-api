import { Dispatch, useCallback, useState } from 'react';
import { addTodo } from '../api/todos';
import { Todo } from '../components/TodoItem/Todo';
import { useError } from './useError';
import { ErrorType } from '../typedefs';

interface Options {
  setTodos: Dispatch<React.SetStateAction<Todo[]>>,
  USER_ID: number,
}

export const usePost = (options: Options) => {
  const { setTodos, USER_ID } = options;

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [unableField, setUnableField] = useState(false);
  const { showError } = useError();

  const addNewTodo = useCallback(
    async (title: string) => {
      if (!title.trim()) {
        showError(ErrorType.TITLE);

        return;
      }

      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      try {
        setUnableField(true);
        setTempTodo({
          id: 0,
          ...newTodo,
        });

        const todo = await addTodo(newTodo);

        setTodos(prevState => [...prevState, todo]);
      } catch {
        showError(ErrorType.ADD);
      } finally {
        setUnableField(false);
        setTempTodo(null);
      }
    }, [],
  );

  return {
    tempTodo,
    unableField,
    addNewTodo,
  };
};
