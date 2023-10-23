import { Todo } from '../types/Todo';

export const clearCompleted = (
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void,
) => {
  const completedTodosId = todos.reduce((acc: number[], curr) => {
    return curr.completed
      ? [...acc, curr.id]
      : acc;
  }, []);

  completedTodosId.forEach(onDeleteTodo);
};
