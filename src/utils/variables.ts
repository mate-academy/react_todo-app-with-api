import { Todo } from '../types/Todo';

export const USER_ID = 11481;

export enum FilterOption {
  Default = '',
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const OPTIONS
  = [FilterOption.All, FilterOption.Completed, FilterOption.Active];

export function filterTodos(option: FilterOption, todos: Todo[]) {
  const filteredTodos = todos.filter(todo => {
    switch (option) {
      case FilterOption.Active: {
        return todo.completed === false;
      }

      case FilterOption.Completed: {
        return todo.completed === true;
      }

      default: {
        return todo;
      }
    }
  });

  return filteredTodos;
}
