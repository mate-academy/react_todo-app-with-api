import { updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Params = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setUpdatingTodosIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export function updateTodoItem({
  todo,
  setTodos,
  setErrorMessage,
  setUpdatingTodosIds,
}: Params) {
  return updateTodo(todo)
    .then((updatedTodo) => {
      setTodos((prevTodos) => {
        return prevTodos.map((prevTodo) => {
          if (prevTodo.id === updatedTodo.id) {
            return updatedTodo;
          }

          return prevTodo;
        });
      });
    })
    .catch(() => {
      setErrorMessage('Unable to update a todo');
      throw new Error();
    })
    .finally(() => {
      setUpdatingTodosIds((prevTodosIds) => {
        return prevTodosIds.filter((id) => id !== todo.id);
      });
    });
}
