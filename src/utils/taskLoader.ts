import { Todo } from '../types/Todo';

export const taskLoader = (
  setTodos: (updateFunction: (todos: Todo[]) => Todo[]) => void,
  taskId: number,
  isLoading: boolean,
) => {
  setTodos(currentTodos => {
    const index = currentTodos
      .findIndex(currentTodo => currentTodo.id === taskId);

    if (index === -1) {
      return currentTodos;
    }

    const updatedTodos = [...currentTodos];

    updatedTodos[index] = { ...currentTodos[index], loading: isLoading };

    return updatedTodos;
  });
};
