import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const filterTodosByStatus = (todos: Todo[], status: Status): Todo[] => {
  if (status === Status.All) {
    return todos;
  }

  return todos.filter(todo =>
    status === Status.Completed ? todo.completed : !todo.completed,
  );
};
