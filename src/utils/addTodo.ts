import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { createTodo } from '../api/todos';

export function addTodo(
  inputValue: string,
  setError: Dispatch<SetStateAction<string>>,
  setTempTodo: Dispatch<SetStateAction<Todo | null>>,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setInputValue: Dispatch<SetStateAction<string>>,
  setIsLoadingIds: Dispatch<SetStateAction<number[]>>,
) {
  setError('');

  if (inputValue.trim() === '') {
    setError('Title should not be empty');

    return;
  }

  const newTempTodo: Todo = {
    id: 0,
    userId: 1551,
    title: inputValue.trim(),
    completed: false,
  };

  setTempTodo(newTempTodo);

  const newTodo: Omit<Todo, 'id'> = {
    userId: 1551,
    title: inputValue.trim(),
    completed: false,
  };

  setIsLoadingIds(currentIds => [...currentIds, newTempTodo.id]);

  createTodo(newTodo)
    .then(currentNewTodo => {
      setTodos(currentToDos => [...currentToDos, currentNewTodo]);
      setInputValue('');
      setTempTodo(null);
      setError('');
    })
    .catch(() => {
      setTempTodo(null);
      setError('Unable to add a todo');
    })
    .finally(() => {
      setIsLoadingIds(currentIds =>
        currentIds.filter(id => id !== newTempTodo.id),
      );
    });
}
