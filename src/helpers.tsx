import { Status } from './types/Status';
import { Todo } from './types/Todo';

export const filteredTodos = (todos: Todo[], status: Status) => {
  switch (status) {
    case Status.Active: {
      return todos.filter(todo => !todo.completed);
    }

    case Status.Completed: {
      return todos.filter(todo => todo.completed);
    }

    case Status.All:
    default: {
      return todos;
    }
  }
};
