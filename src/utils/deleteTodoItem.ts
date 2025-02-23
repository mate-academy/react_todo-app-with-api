import { Dispatch, SetStateAction } from 'react';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export function deleteTodoItem(
  id: number,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setError: Dispatch<SetStateAction<string>>,
  setIsLoadingIds: Dispatch<SetStateAction<number[]>>,
) {
  setIsLoadingIds(currentIds => [...currentIds, id]);

  deleteTodo(id)
    .then(() => {
      setTodos(currentToDos => currentToDos.filter(item => item.id !== id));
    })
    .catch(() => {
      setTodos(todos);
      setError('Unable to delete a todo');
    })
    .finally(() => {
      setIsLoadingIds(currentIds => currentIds.filter(item => item !== id));
    });
}
