import { FilterTypes } from '../types/Filter';
import { Todo } from '../types/Todo';

export function getFilteredTodo(
  todos: Todo[],
  selectedTab: FilterTypes,
) {
  const filterByType = todos.filter((todo) => {
    switch (selectedTab.id) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return todo;
    }
  });

  return filterByType;
}

export function getCompletedTodos(todos: Todo[]) {
  return todos.filter(({ completed }) => completed);
}
