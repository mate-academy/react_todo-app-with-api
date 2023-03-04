import { Filter } from '../../enums/Filter';
import { Todo } from '../../types/Todo';

export type Props = {
  filter: Filter;
  setFilter: (value: Filter) => void;
  onClear: () => void;
  todos: Todo[];
};
