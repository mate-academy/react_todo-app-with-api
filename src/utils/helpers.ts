import { Filter } from '../types/Filters';
import { Todo } from '../types/Todo';

export const filteredTodosByComplited = (
  todos: Todo[],
  complitedFilter: Filter,
) => {
  if (complitedFilter === Filter.All) {
    return todos;
  }

  return todos.filter((todo) => (Filter.Complited === complitedFilter
    ? todo.completed
    : !todo.completed));
};

export const getComplitedTodoIds = (todos: Todo[]) => {
  const complitedTodos = todos.filter((todo) => todo.completed);

  return complitedTodos.map((todo) => todo.id);
};
