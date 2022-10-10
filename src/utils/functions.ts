import { FilterTypes, FilterBy } from '../types/Filter';
import { Todo } from '../types/Todo';

export function getFilteredTodo(
  todos: Todo[],
  selectedTab: FilterTypes,
) {
  const filterByType = todos.filter((todo) => {
    switch (selectedTab.id) {
      case FilterBy.Active:
        return !todo.completed;

      case FilterBy.Completed:
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
