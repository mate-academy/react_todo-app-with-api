import { Todo } from '../types/Todo';

export const filterTodosByStatus = (todos: Todo[], filterBy: string) => {
  switch (filterBy) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
