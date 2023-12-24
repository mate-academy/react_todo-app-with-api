import { Status } from './types/Status';
import { Todo } from './types/Todo';

export const filteredTodos = (todos: Todo[], status: Status) => {
  const preparedTodos = [...todos];

  switch (status) {
    case Status.all: {
      return preparedTodos;
    }

    case Status.active: {
      return preparedTodos.filter(todo => !todo.completed);
    }

    case Status.completed: {
      return preparedTodos.filter(todo => todo.completed);
    }

    default: {
      return preparedTodos;
    }
  }
};
