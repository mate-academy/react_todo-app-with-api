import { getTodos } from '../api/todos';
import { errorText } from '../constants';
import { Setters } from '../types/Setters';
import { TodoWithLoader } from '../types/TodoWithLoader';

export function handleGettingTodos(setters: Setters) {
  const { setTodos, setErrorMessage } = setters;

  return getTodos()
    .then(todosFromServer => {
      if (todosFromServer) {
        const newTodos: TodoWithLoader[] = todosFromServer.map(todo => {
          return {
            ...todo,
            loading: false,
          };
        });

        setTodos(newTodos);
      } else {
        setTodos([]);
      }
    })
    .catch(() => {
      setErrorMessage(errorText.noTodos);
    });
}
