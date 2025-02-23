import { deleteTodo } from '../api/todos';
import { Errors } from './Errors';
import { Todo } from '../types/Todo';
import { handleError } from './handleError';

export const deletingTodo = (
  IdsArray: number[],
  setError: (error: Errors) => void,
  setTodos: (todos: (prevState: Todo[]) => Todo[]) => void,
  setPendingTodosId: (id: (prevState: number[]) => number[]) => void,
): Promise<PromiseSettledResult<void>[]> => {
  return Promise.allSettled(
    IdsArray.map(async id => {
      setPendingTodosId((prevState: number[]) => [...prevState, id]);
      try {
        await deleteTodo(id);
        setTodos((prevState: Todo[]) =>
          prevState.filter(todo => todo.id !== id),
        );
        setPendingTodosId((prevState: number[]) => {
          const indexOfId = prevState.findIndex(ids => ids === id);

          return prevState.splice(indexOfId, 1);
        });
      } catch {
        handleError(Errors.DeleteTodo, setError);
      }
    }),
  );
};
