import { updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { Dispatch, SetStateAction } from 'react';
import { ErrorMessages } from '../enum/ErrorMessages';

interface Props {
  todos: Todo[];
  setErrorMessage: (message: ErrorMessages) => void;
  setTodoLoading: (id: number, status: boolean) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
}

export const updateAllTodos = async ({
  todos,
  setErrorMessage,
  setTodoLoading,
  setTodos,
}: Props) => {
  const newStatus = todos.some(todo => !todo.completed);
  const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

  try {
    setErrorMessage(ErrorMessages.none);

    todosToUpdate.forEach(todo => setTodoLoading(todo.id, true));

    const promises = todosToUpdate.map(todo =>
      updateTodo(todo.id, { completed: newStatus }),
    );

    await Promise.all(promises);

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todosToUpdate.some(updatedTodo => updatedTodo.id === todo.id)
          ? { ...todo, completed: newStatus }
          : todo,
      ),
    );
  } catch (error) {
    setErrorMessage(ErrorMessages.edit);
  } finally {
    todosToUpdate.forEach(todo => setTodoLoading(todo.id, false));
  }
};
