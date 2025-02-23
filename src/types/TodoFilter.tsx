import { Todo } from './Todo';

export enum TodoStatusFilter {
  All = 'All',
  Completed = 'Completed',
  Active = 'Active',
}

export const filterTodo = (todos: Todo[], filter: TodoStatusFilter): Todo[] => {
  switch (filter) {
    case TodoStatusFilter.Completed:
      return todos.filter(todo => todo.completed);
    case TodoStatusFilter.Active:
      return todos.filter(todo => !todo.completed);
    case TodoStatusFilter.All:
    default:
      return todos;
  }
};
