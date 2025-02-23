import { FilteredTodos } from '../enums/FilteredTodos';
import { Todo } from '../types/Todo';

const handleFilteredTodos = (todos: Todo[], filterSelected: FilteredTodos) => {
  switch (filterSelected) {
    case FilteredTodos.active:
      return todos.filter(todo => !todo.completed);
    case FilteredTodos.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export default handleFilteredTodos;
