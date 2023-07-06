import { Todo } from './types/Todo';
import { TodosFilter } from './types/TodosFilter';

export const filterTodos = (todos: Todo[], filterType: TodosFilter) => {
  switch (filterType) {
    case TodosFilter.ALL:
      return todos;
    case TodosFilter.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case TodosFilter.COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      throw new Error('Unexpected type!');
  }
};
