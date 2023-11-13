import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

function filterBySelect(
  todo: Todo,
  selectedOption: string,
) : boolean {
  switch (selectedOption) {
    case TodoStatus.Active:
      return !todo.completed;
    case TodoStatus.Completed:
      return todo.completed;
    default:
      return true;
  }
}

export function filterTodos(todos: Todo[], selectedOption: string) {
  if (!selectedOption) {
    return todos;
  }

  return todos.filter((todo) => (
    filterBySelect(todo, selectedOption)
  ));
}
