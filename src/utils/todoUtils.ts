import { StatusValue } from '../types/StatusValue';
import { Todo } from '../types/Todo';

export const preparedTodos = (todos: Todo[], statusTodo: StatusValue) => {
  return todos.filter(todo => {
    switch (statusTodo) {
      case StatusValue.ALL:
        return todo;

      case StatusValue.ACTIVE:
        return todo.completed === false;

      case StatusValue.COMPLETED:
        return todo.completed === true;

      default:
        throw new Error(`Wrong filter, ${statusTodo} is not defined`);
    }
  });
};

export const getcompletedTodosIds = (todos: Todo[]) => {
  return todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);
};

export const getcompletedTodos = (todos: Todo[]) => {
  return todos
    .map(todo => todo.completed);
};

export const filterTodosByCompletion = (todos: Todo[]) => {
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  return todos
    .filter(todo => (
      isAllTodosCompleted
        ? todo.completed
        : !todo.completed
    ));
};
