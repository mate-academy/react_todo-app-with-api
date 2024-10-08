import { Todo } from '../types/Todo';

export const setLoadingState = (
  todos: Todo[],
  ids: number[],
  state: boolean,
) => {
  return todos.map(todo =>
    ids.includes(todo.id) ? { ...todo, loading: state } : todo,
  );
};
