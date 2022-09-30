import { FilterType } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

export type Props = {
  filterType: string;
  handleFilterType: (type: FilterType) => void;
  todos: Todo[];
  deleteCompleted: () => void;
};
