import { Dispatch, useCallback, useState } from 'react';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorType } from '../typedefs';

interface Options {
  setTodos: Dispatch<React.SetStateAction<Todo[]>>,
  USER_ID: number,
  showError: (error: ErrorType) => void
}

export const usePost = (options: Options) => {
  const { setTodos, USER_ID, showError } = options;

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setisInputDisabled] = useState(false);

  const addNewTodo = useCallback(
    async (title: string) => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        showError(ErrorType.TITLE);

        return;
      }

      const newTodo = {
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      };

      try {
        setisInputDisabled(true);
        setTempTodo({
          id: 0,
          ...newTodo,
        });

        const todo = await addTodo(newTodo);

        setTodos(prevState => [...prevState, todo]);
      } catch {
        showError(ErrorType.ADD);
      } finally {
        setisInputDisabled(false);
        setTempTodo(null);
      }
    }, [],
  );

  return {
    tempTodo,
    isInputDisabled,
    addNewTodo,
  };
};
