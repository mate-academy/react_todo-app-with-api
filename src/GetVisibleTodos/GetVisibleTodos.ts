import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

export const getVisibleTodos = (todoList: Todo[], filter: Status): Todo[] => {
  switch (filter) {
    case Status.Active:
      return todoList.filter(todo => !todo.completed);
    case Status.Completed:
      return todoList.filter(todo => todo.completed);
    default:
      return todoList;
  }
};
