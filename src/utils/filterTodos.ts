import { Todo } from '../types/Todo';
import { FilterBy } from './enums';

export const filterTodos = (todosArray: Todo[], filter: FilterBy) => {
  return todosArray.filter(({ completed }) => (
    filter === FilterBy.Active ? !completed : completed
  ));
};
