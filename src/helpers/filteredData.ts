import { Todo } from '../types/Todo';
import { FilterBy } from '../types/types';

export const filteredData = <T>(
  data: Array<T & Partial<Todo>>,
  filter: FilterBy,
): T[] => {
  switch (filter) {
    case (FilterBy.Active):
      return data.filter(({ completed }) => !completed);

    case (FilterBy.Completed):
      return data.filter(({ completed }) => completed);

    case (FilterBy.All):
    default:
      return data;
  }
};
