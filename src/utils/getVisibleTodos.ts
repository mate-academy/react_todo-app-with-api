import { FilterStatusType } from '../types/FilterStatusType';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (todoList: Todo[], filter: FilterStatusType) => {
  let filteredTodoList = [...todoList];

  switch (filter) {
    case FilterStatusType.Active:
      filteredTodoList = filteredTodoList.filter(todo => !todo.completed);
      break;
    case FilterStatusType.Completed:
      filteredTodoList = filteredTodoList.filter(todo => todo.completed);
      break;
    default:
      break;
  }

  return filteredTodoList;
};
