import { Dispatch, SetStateAction } from 'react';
import { updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { deleteTodoItem } from './deleteTodoItem';

export function renameTodo(
  e: React.FormEvent,
  newTitle: string,
  todo: Todo,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setIsEditing: Dispatch<SetStateAction<boolean>>,
  setIsLoadingIds: Dispatch<SetStateAction<number[]>>,
  setError: Dispatch<SetStateAction<string>>,
) {
  e.preventDefault();

  if (newTitle.trim() === todo.title) {
    setIsEditing(false);

    return;
  }

  if (newTitle.trim() === '') {
    deleteTodoItem(todo.id, todos, setTodos, setError, setIsLoadingIds);

    return;
  }

  setIsLoadingIds(currentIds => [...currentIds, todo.id]);

  const updatedTodo = { ...todo, title: newTitle.trim() };

  updateTodo(updatedTodo)
    .then(updatedTodoFromServer => {
      setTodos(currentToDos =>
        currentToDos.map(currentTodo =>
          currentTodo.id === updatedTodoFromServer.id
            ? updatedTodoFromServer
            : currentTodo,
        ),
      );
      setIsEditing(false);
    })
    .catch(() => setError('Unable to update a todo'))
    .finally(() => {
      setIsLoadingIds(currentIds => currentIds.filter(id => id !== todo.id));
    });
}
