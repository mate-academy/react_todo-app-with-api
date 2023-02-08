import { Todo } from '../types/Todo';

export const normalizeTodos = (todos: Todo[]) => {
  return todos.map(({
    id,
    title,
    completed,
    userId,
  }) => {
    return {
      id,
      userId,
      title,
      completed,
    };
  });
};

export const countUnfinished = (todos: Todo[]): number => {
  return todos.filter(todo => !todo.completed).length;
};

export const addIfNotInArr = (arr: number[], id: number) => {
  if (!arr.includes(id)) {
    return [...arr, id];
  }

  return arr;
};
