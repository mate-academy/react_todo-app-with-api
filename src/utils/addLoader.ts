import { Todo } from '../types/Todo';

export const addLoader = (
  setTodos: (updateFunction: (todos: Todo[]) => Todo[]) => void,
  addId: number,
  isLoading: boolean,
) => {
  setTodos(currentTodos => {
    const index = currentTodos
      .findIndex(currentTodo => currentTodo.id === addId);

    if (index === -1) {
      return currentTodos;
    }

    const updatedTodos = [...currentTodos];

    updatedTodos[index] = { ...currentTodos[index], loading: isLoading };

    return updatedTodos;
  });
};
