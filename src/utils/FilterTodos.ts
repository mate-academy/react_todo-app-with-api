import { Todo } from '../types/Todo';

export function filterTodos(
  todos: Todo[],
  tempTodo: Todo | null,
  status: string,
): Todo[] {
  const list = [...todos];

  if (tempTodo) {
    list.push(tempTodo);
  }

  return list.filter(todo => {
    switch (status) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });
}
