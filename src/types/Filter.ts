import { FilterType } from './FilterType';

export type FilterProps = {
  todosQty: number,
  filterTodo: (value: FilterType) => void,
  selectedTodoFilter: FilterType,
  handleClearCompleted: () => void,
  hasCompletedTodos: boolean,
};
