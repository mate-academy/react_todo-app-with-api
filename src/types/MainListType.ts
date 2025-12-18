import type { Todo } from './Todo';

export type MainListType = {
  shownTodos: Todo[];
  onUpdate: (value: Todo) => void;
  editFieldVal: number | null;
  onEditFieldVal: (value: number | null) => void;
  editInputVal: string;
  onEditInputVal: (value: string) => void;
  onEditHandle: (value: Todo) => void;
  onDelete: (value: number) => void;
  tempTodoItem: Todo | null;
  loadId: number | 'all' | null;
  onLoadId: (value: number | 'all' | null) => void;
  inputMainFocus: React.RefObject<HTMLInputElement>;
};
