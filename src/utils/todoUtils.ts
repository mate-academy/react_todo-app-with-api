import { StatusValue } from '../types/StatusValue';
import { Todo } from '../types/Todo';

export const preparedTodos = (todos: Todo[], todoFilter: StatusValue) => {
  return todos.filter(todo => {
    switch (todoFilter) {
      case StatusValue.ALL:
        return todo;

      case StatusValue.ACTIVE:
        return !todo.completed;

      case StatusValue.COMPLETED:
        return todo.completed;

      default:
        throw new Error(`Wrong filter, ${todoFilter} is not defined`);
    }
  });
};

export const getCompletedTodoIds = (todos: Todo[]) => {
  return todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);
};

export const filteredTodosByCompletion = (todos: Todo[]) => {
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  return todos
    .filter(todo => (
      isAllTodosCompleted
        ? todo.completed
        : !todo.completed
    ));
};

export const capitalize = (word: string) => {
  return word[0].toUpperCase() + word.slice(1);
};
