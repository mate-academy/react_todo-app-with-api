import { patchTodo } from '../api/todos';
import { Errors } from './Errors';
import { Todo } from '../types/Todo';
import { handleError } from './handleError';
import { TodoOmited } from '../types/TodoOmited';

export const updatingTodo = (
  todosArray: TodoOmited[],
  setError: (error: Errors) => void,
  setTodos: (todos: (prevState: Todo[]) => Todo[]) => void,
  setPendingTodosId: (id: (prevState: number[]) => number[]) => void,
): Promise<void[]> => {
  return Promise.all(
    todosArray.map(async todo => {
      setPendingTodosId((prevState: number[]) => [...prevState, todo.id]);
      try {
        const patchedTodo = await patchTodo(todo);

        setTodos((prevState: Todo[]) =>
          prevState.map(currentTodo =>
            todo.id !== currentTodo.id ? currentTodo : patchedTodo,
          ),
        );
        setPendingTodosId((prevState: number[]) =>
          prevState.filter(ids => ids !== todo.id),
        );
      } catch {
        handleError(Errors.UpdateTodo, setError);
        throw new Error(Errors.UpdateTodo);
      }
    }),
  );
};
