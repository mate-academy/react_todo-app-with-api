import { Todo } from '../types/Todo';

export function filterTodos(todos: Todo[], filterBy: string | null) {
  return todos.filter(({ completed }) => {
    switch (filterBy) {
      case 'active':
        return completed === false;

      case 'completed':
        return completed === true;

      default:
        return true;
    }
  });
}
