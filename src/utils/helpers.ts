import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export const filter = (todos: Todo[], filterBy: FilterBy) => {
  switch (filterBy) {
    case 'Active':
      return todos.filter(todo => !todo.completed || todo.id === 0);

    case 'Completed':
      return todos.filter(todo => todo.completed || todo.id === 0);

    default:
      return todos;
  }
};

export const countActiveTodos = (todoList: Todo[]) => {
  const activeTodos = todoList.filter(todo => !todo.completed && todo.id !== 0);

  return activeTodos.length;
};

export const countCompletedTodos = (todoList: Todo[]) => {
  const activeTodos = todoList.filter(todo => todo.completed);

  return activeTodos.length;
};
