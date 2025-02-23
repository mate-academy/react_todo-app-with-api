import { Sort } from '../types/Sort';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], sortBy: Sort) => {
  const activeTodo = [...todos].filter(todo => todo.completed === false);
  const completedTodo = [...todos].filter(todo => todo.completed === true);

  let filteredTodos = todos;

  if (sortBy === 'Active') {
    filteredTodos = activeTodo;
  }

  if (sortBy === 'Completed') {
    filteredTodos = completedTodo;
  }

  return { filteredTodos, activeTodo, completedTodo };
};
