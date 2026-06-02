import { Todo, FilterTodos } from '../types/Todo';

export function getFilteredTodos(todos: Todo[], filterBy: FilterTodos) {
  switch (filterBy) {
    case FilterTodos.Active:
      return todos.filter(todo => !todo.completed);

    case FilterTodos.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}
