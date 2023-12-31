import { Status } from './types/Status';
import { Todo } from './types/Todo';

export const filteredTodos = (todos: Todo[], status: Status) => {
  const preparedTodos = [...todos];

  switch (status) {
    case Status.Active: {
      return preparedTodos.filter(todo => !todo.completed);
    }

    case Status.Completed: {
      return preparedTodos.filter(todo => todo.completed);
    }

    case Status.All:
    default: {
      return preparedTodos;
    }
  }
};
