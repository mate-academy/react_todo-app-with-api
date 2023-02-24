import { Todo } from '../types/Todo';
import { Filter } from '../types/filter';
import { NewTodo } from '../types/newTodo';

export const getVisibleTodos = (
  todos: (Todo | NewTodo)[],
  filterBy: Filter,
): (Todo | NewTodo
  )[] => (
  todos.filter(todo => {
    switch (filterBy) {
      case Filter.COMPLETED:
        return todo.completed;
      case Filter.ACTIVE:
        return !todo.completed;
      default:
        return todo;
    }
  })
);
