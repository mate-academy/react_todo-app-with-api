import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2248;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getCompletedTodos = (allTodos: Todo[]) => {
  return allTodos.filter(todo => todo.completed);
};

export const getActiveTodos = (allTodos: Todo[]) => {
  return allTodos.filter(todo => !todo.completed);
};

export enum FilterEnum {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const clearCompleted = (
  allTodos: Todo[],
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  return async () => {
    const todosIdToDelete = allTodos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    const deletedIds: number[] = [];

    if (todosIdToDelete.length === 0) {
      return;
    }

    setLoading(true);

    try {
      await Promise.all(
        todosIdToDelete.map(async id => {
          try {
            await client.delete(`/todos/${id}`);
            deletedIds.push(id);
          } catch (error) {
            setErrorMessage('Unable to delete a todo');
          }
        }),
      );

      setAllTodos(allTodos.filter(todo => !deletedIds.includes(todo.id)));
    } catch (error) {
      setErrorMessage('Unable to delete one or more todos');
    } finally {
      setLoading(false);
    }
  };
};

export const filterTodos = (curFilter: FilterEnum, allTodos: Todo[]) => {
  switch (curFilter) {
    case FilterEnum.ALL:
      return allTodos;
    case FilterEnum.ACTIVE:
      const activeTodos = getActiveTodos(allTodos);

      return activeTodos;
    case FilterEnum.COMPLETED:
      const completedTodos = getCompletedTodos(allTodos);

      return completedTodos;
    default:
      throw new Error(`Unsupported filter type: ${curFilter}`);
  }
};
