import { SortType } from "./SortType";

export interface FooterProps {
  activeTodosCount: number;
  currentSortType: SortType;
  hasCompletedTodos: boolean;
  onSortChange: (value: SortType) => void;
  deletedAllCompleted: () => void;
}
