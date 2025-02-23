import { Todo } from '../types/Todo';

export const getIdsOfActiveTodos = (todos: Todo[]) => {
  return todos.reduce((acc: number[], todo) => {
    if (!todo.completed) {
      acc.push(todo.id);
    }

    return acc;
  }, []);
};
