import { FilterType } from '../Header/HeaderPropTypes';

export type Props = {
  setFelterType: (type :FilterType) => void;
  filterType: FilterType;
  clearCompleted: () => void;
  countOfItemsLeft: number;
  todosLength: number;
};
