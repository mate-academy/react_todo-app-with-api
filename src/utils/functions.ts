import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export function chooseActіveArray(filter: Filter, todos: Todo[]) {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export function findMaxId(array: Todo[] | []) {
  if (array.length === 0) {
    return 1;
  }

  return Math.max(...array.map((todo: Todo) => todo.id)) + 1;
}

export function getTodosToToggle(todos: Todo[]) {
  const completedTodos = todos.filter(item => item.completed);

  if (completedTodos.length === todos.length || completedTodos.length === 0) {
    return todos;
  } else {
    return todos.filter(todo => !todo.completed);
  }
}
