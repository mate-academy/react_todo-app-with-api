import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';

export function toggleCompletedTodo(
  todoToUpdate: Todo,
  setIsLoadingIds: Dispatch<SetStateAction<number[]>>,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setError: Dispatch<SetStateAction<string>>,
) {
  setIsLoadingIds(currentIds => [...currentIds, todoToUpdate.id]);

  const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

  updateTodo(updatedTodo)
    .then(updatedTodoFromServer => {
      setTodos(currentToDos =>
        currentToDos.map(item =>
          item.id === updatedTodoFromServer.id ? updatedTodoFromServer : item,
        ),
      );
    })
    .catch(() => {
      setError('Unable to update a todo');
    })
    .finally(() => {
      setIsLoadingIds(currentIds =>
        currentIds.filter(id => id !== todoToUpdate.id),
      );
    });
}
