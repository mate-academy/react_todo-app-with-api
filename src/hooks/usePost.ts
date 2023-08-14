import { Dispatch, useCallback, useState } from 'react';
import { addTodo } from '../api/todos';
import { Todo } from '../components/TodoItem/Todo';
import { ErrorType } from '../typedefs';

interface Options {
  setTodos: Dispatch<React.SetStateAction<Todo[]>>,
  USER_ID: number,
  showError: (error: ErrorType) => void
}

export const usePost = (options: Options) => {
  const { setTodos, USER_ID, showError } = options;

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [unableField, setUnableField] = useState(false);

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
